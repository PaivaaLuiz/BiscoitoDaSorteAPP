import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      textoFrase: '',
      img: require('./src/biscoito.png'),
      podeAbrir: true,
      tempoRestante: ''
    };

    this.frases = [
      'Grandes conquistas começam com pequenos passos.',
      'A disciplina hoje é o sucesso de amanhã.',
      'Você é mais capaz do que imagina.',
      'Persistência supera talento quando o talento não persiste.',
      'Cada dia é uma nova oportunidade de evoluir.',
      'Não espere motivação, crie hábito.',
      'O esforço silencioso constrói resultados barulhentos.'
    ];
  }

  componentDidMount(){
    this.verificarTempo();
    this.timer = setInterval(this.verificarTempo, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  verificarTempo = async () => {
    const agora = new Date().getTime();
    const ultimoHorario = await AsyncStorage.getItem('ultimo_biscoito');

    const seisHoras = 6 * 60 * 60 * 1000;

    if(ultimoHorario !== null){
      const diferenca = agora - parseInt(ultimoHorario);

      if(diferenca < seisHoras){
        const restante = seisHoras - diferenca;

        const horas = Math.floor(restante / (1000 * 60 * 60));
        const minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((restante % (1000 * 60)) / 1000);

        this.setState({
          podeAbrir: false,
          tempoRestante: `${horas}h ${minutos}m ${segundos}s`
        });

        return;
      }
    }

    // Liberado
    this.setState({
      podeAbrir: true,
      tempoRestante: ''
    });
  }

  quebraBiscoito = async () => {

    if(!this.state.podeAbrir){
      return;
    }

    let numeroAleatorio = Math.floor(Math.random() * this.frases.length );

    this.setState({
      textoFrase: '"' + this.frases[numeroAleatorio] + '"',
      img: require('./src/biscoitoAberto.png'),
      podeAbrir: false
    });

    const agora = new Date().getTime();
    await AsyncStorage.setItem('ultimo_biscoito', agora.toString());
  }

  render(){
    return(
      <View style={styles.container}> 
      
        <Image
          source={this.state.img}
          style={styles.img}
        />

        <Text style={styles.textoFrase}>
          {this.state.textoFrase}
        </Text>

        { !this.state.podeAbrir && (
          <Text style={styles.timer}>
            Próximo biscoito em: {this.state.tempoRestante}
          </Text>
        )}

        <TouchableOpacity 
          style={[
            styles.botao,
            { opacity: this.state.podeAbrir ? 1 : 0.5 }
          ]}
          onPress={this.quebraBiscoito}
          disabled={!this.state.podeAbrir}
        >
          <View style={styles.btnArea}>
            <Text style={styles.btnTexto}>
              {this.state.podeAbrir ? 'Quebrar Biscoito' : 'Aguarde...'}
            </Text>
          </View>
        </TouchableOpacity>  

      </View>    
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img:{
    width: 250,
    height: 250,
  },
  textoFrase:{
    fontSize: 20,
    color: '#3B82F6',
    margin: 30,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  timer:{
    fontSize: 16,
    marginBottom: 20,
    color: '#555'
  },
  botao:{
    width: 230,
    height: 50,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 25,
    backgroundColor: '#3B82F6'
  },
  btnArea:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTexto:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  }
});

export default App;