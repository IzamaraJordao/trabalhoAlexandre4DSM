import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  DivContainer,
} from './styles';
import api from '../services/api';

export default class Main extends Component {
  state = {
    name: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    try {
      const {name, users, loading} = this.state;

      this.setState({loading: true});
      this.setState({loading: true});
      const response = await api.get(`/character/?name=${name}`);
      const episodeId = await response.data.results[0].episode[0]
        .split('/')
        .pop();
      const locationId = await response.data.results[0].location.url
        .split('/')
        .pop();
      const responseEpisode = await api.get(`/episode/${episodeId}`);

      const data = {
        image: response.data.results[0].image,
        name: response.data.results[0].name,
        status: response.data.results[0].status,
        locationName: response.data.results[0].location.name,
        locationUrl: locationId,
        species: response.data.results[0].species,
        episode: responseEpisode.data.episode,
        episodeQtd: response.data.results[0].episode.length,
      };

      this.setState({
        users: [data, ...users],
        name: '',
        loading: false,
      });

     
      Keyboard.dismiss();
    } catch (error) {
      alert('Usuário não encontrado');
      this.setState({loading: false});
    }
  };

  render() {
    const {name, users, loading} = this.state;
    

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={name}
            onChangeText={text => this.setState({name: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loadind={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          showVerticalScrollIndicator={false}
          data={users}
          renderItem={({item}) => (
            <Form>
              <DivContainer>
                <Avatar source={{uri: item.image}} />
              </DivContainer>

              <DivContainer>
                <Name>{item.name}</Name>
                <Bio>
                  Status: <Name>{item.status}</Name>
                </Bio>
                <Bio>
                  Localização <Name>{item.locationName}</Name>
                </Bio>
                <Bio>
                  Nome do episodio <Name>{item.episode}</Name>
                </Bio>

                <Form>
                  <ProfileButton
                    onPress={() => {
                      this.props.navigation.navigate('user', {user: item});
                    }}>
                    <ProfileButtonText>Detalhes</ProfileButtonText>
                  </ProfileButton>

                  <ProfileButton
                    onPress={() => {
                      this.setState({
                        users: users.filter(user => user.login !== item.login),
                      });
                    }}
                    style={{backgroundColor: '#FF0000'}}>
                    <ProfileButtonText>Excluir</ProfileButtonText>
                  </ProfileButton>
                </Form>
              </DivContainer>
            </Form>
          )}
        />
      </Container>
    );
  }
}
