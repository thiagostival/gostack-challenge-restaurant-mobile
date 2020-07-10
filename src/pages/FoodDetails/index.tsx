import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    try {
      api.get(`/foods/${routeParams.id}`).then(response => {
        const foodsFormatted = {
          ...response.data,
          formattedPrice: formatValue(response.data.price),
        };
        setFood(foodsFormatted);

        const setExtraQuantity = foodsFormatted.extras.map(
          (getExtra: Extra) => ({
            ...getExtra,
            quantity: 0,
          }),
        );
        setExtras(setExtraQuantity);
      });

      api.get(`/favorites?id_like=${routeParams.id}`).then(responseFavorite => {
        const favorites = responseFavorite.data as [];
        if (favorites.length !== 0) {
          setIsFavorite(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [routeParams]);

  function handleIncrementExtra(id: number): void {
    const copyExtras = extras.map(extra => extra);

    const indexExtra = extras.findIndex(extra => extra.id === id);
    copyExtras[indexExtra].quantity += 1;

    setExtras(copyExtras);
  }

  function handleDecrementExtra(id: number): void {
    const copyExtras = extras.map(extra => extra);

    const indexExtra = extras.findIndex(extra => extra.id === id);
    copyExtras[indexExtra].quantity -= 1;

    setExtras(copyExtras);
  }

  function handleIncrementFood(): void {
    setFoodQuantity(state => state + 1);
  }

  function handleDecrementFood(): void {
    setFoodQuantity(state => (state > 1 ? state - 1 : 1));
  }

  const toggleFavorite = useCallback(() => {
    setIsFavorite(state => {
      if (!state === true) {
        api.post('/favorites', {
          id: food.id,
          name: food.name,
          description: food.description,
          price: food.price,
          thumbnail_url: food.image_url,
        });
        return !state;
      }
      api.delete(`/favorites/${food.id}`);
      return !state;
    });
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    const extraPrice = extras.reduce(
      (total, extra) => total + extra.value * extra.quantity,
      0,
    );
    return formatValue((extraPrice + food.price) * foodQuantity);
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    const extraPrice = extras.reduce(
      (total, extra) => total + extra.value * extra.quantity,
      0,
    );
    const total = (extraPrice + food.price) * foodQuantity;

    await api.post('/orders', {
      product_id: food.id,
      name: food.name,
      description: food.description,
      price: total,
      thumbnail_url: food.image_url,
      extras: food.extras,
    });

    setTimeout(() => navigation.goBack(), 2);
  }

  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdittionalItemText testID="food-quantity">
                {foodQuantity}
              </AdittionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
