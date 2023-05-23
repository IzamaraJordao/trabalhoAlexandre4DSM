import React, {Component} from 'react';
import api from '../services/api';
import {
  Container,
  Header,
  Avatarperfil,
  Nameperfil,
  Bioperfil,
  Stars,
  Starred,
  Info,
  Title,
  Author,
  Bio,
  Name,
  NameDetal,
  ContainerDetal,
  Curiosity,
} from './styles';

export default class User extends Component {
  state = {
    location: [],
    locationResidentsLength: 0,
  };

  async componentDidMount() {
    const {route} = this.props;
    const {user} = route.params;

    const response = await api.get(`/location/${user.locationUrl}`);
    const locationResidentsLength = response.data.residents.length;
    this.setState({
      location: response.data,
      locationResidentsLength: locationResidentsLength,
    });
  }

  render() {
    const {route} = this.props;
    const {user} = route.params;
    const {location, locationResidentsLength} = this.state;

    return (
      <Container>
        <Header>
          <Avatarperfil source={{uri: user.image}} />
          <Curiosity>Curiosidades: </Curiosity>
        </Header>
        <ContainerDetal>
          <NameDetal>Dados Pessoais</NameDetal>
          <Bio>
            Nome:<Name>{user.name}</Name>
          </Bio>
          <Bio>
            Espécie: <Name>{user.species}</Name>
          </Bio>
        </ContainerDetal>

        <ContainerDetal>
          <NameDetal>Cidade</NameDetal>
          <Bio>
            Cidade: <Name>{location.name}</Name>
          </Bio>
          <Bio>
            Tipo da cidade: <Name>{location.type}</Name>
          </Bio>
          <Bio>
            Quantidade de habitantes: <Name>{locationResidentsLength}</Name>
          </Bio>
        </ContainerDetal>

        <ContainerDetal>
          <NameDetal>Episódios:</NameDetal>
          <Bio>
            Sou famoso/a, possuo <Name>{user.episodeQtd}</Name> episódios da
            minha série
          </Bio>
          <Bio>
            Meu primeiro episodio foi <Name>{user.episode}</Name>
          </Bio>
        </ContainerDetal>

        <Stars
          data={location}
          renderItem={({item}) => (
            <Starred>
              <Info>
                <Nameperfil>{user.name}</Nameperfil>
                <Bioperfil>{user.species}</Bioperfil>
                <Name>Cidade</Name>
                <Bio>{item.name}</Bio>
                <Name>Tipo da cidade</Name>
                <Bio>{item.type}</Bio>
                <Name>Quantidade de habitantes</Name>
                <Bio>{item.residents.lenght}</Bio>
                <Title>{item.species}</Title>
                <Title>{item.species}</Title>
                <Author>{item.episodeQtd}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
