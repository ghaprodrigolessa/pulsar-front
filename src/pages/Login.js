/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
// funções.
import toast from '../functions/toast';
// componentes.
import Logo from '../components/Logo';
// router.
import { useHistory } from 'react-router-dom';

function Login() {

  // context.
  const {
    html,
    setsettings,
    pagina, setpagina,
    settoast,
    sethospital,
    setunidade,
    unidades, setunidades,
    setusuario,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 0) {
      setviewlistaunidades(0);
      loadUnidades();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // carregar configurações do usuário logado.
  const loadSettings = (usuario) => {
    axios.get(html + 'settings/' + usuario).then((response) => {
      var x = [];
      x = response.data.rows;
      setsettings(response.data.rows);
      if (x.length < 1) {
        var obj = {
          id_usuario: usuario,
          tema: 1,
          card_diasinternacao: 1,
          card_alergias: 1,
          card_anamnese: 1,
          card_evolucoes: 1,
          card_propostas: 1,
          card_precaucoes: 1,
          card_riscos: 1,
          card_alertas: 1,
          card_sinaisvitais: 1,
          card_body: 1,
          card_vm: 1,
          card_infusoes: 1,
          card_dieta: 1,
          card_culturas: 1,
          card_antibioticos: 1,
          card_interconsultas: 1
        }
        axios.post(html + 'insert_settings', obj).then(() => {
          toast(settoast, 'CONFIGURAÇÕES PESSOAIS ARMAZENADAS NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
          axios.get(html + 'settings/' + usuario).then((response) => {
            setsettings(response.data.rows);
          });
        })
      }
    })
  }

  // recuperando registros de unidades cadastradas na aplicação.
  const loadUnidades = () => {
    axios.get(html + 'list_unidades').then((response) => {
      setunidades(response.data.rows);
    })
  }

  // recuperando registros de acessos do usuário logado.
  const [acessos, setacessos] = useState([]);
  const loadAcessos = (id_usuario) => {
    var obj = {
      id_usuario: id_usuario
    }
    axios.post(html + 'getunidades', obj,
      /*
      Forma de passar o token pelo header (deve ser repetida em toda endpoint).
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      */
    ).then((response) => {
      setacessos(response.data.rows);
      setviewlistaunidades(1);
    })
  }

  // checando se o usuário inserido está registrado no sistema.
  let user = null;
  let password = null;
  var timeout = null;
  var token = null;
  const checkLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      user = document.getElementById('inputUsuario').value
      password = document.getElementById('inputSenha').value
      var obj = {
        usuario: user,
        senha: password,
      }
      axios.post(html + 'checkusuario', obj).then((response) => {
        var x = [0, 1];
        x = response.data;
        // armazenando o token no localStorage.
        token = x.token;
        console.log('TOKEN RECEBIDO DA API: ' + token);
        localStorage.setItem("token", x.token);
        // adicionando o token ao header.
        setAuthToken(x.token);

        if (x.auth == true) {
          toast(settoast, 'OLÁ, ' + x.nome.split(' ', 1), 'rgb(82, 190, 128, 1)', 3000);
          setusuario(
            {
              id: x.id,
              nome_usuario: x.nome.split(' ', 1),
            }
          );
          loadAcessos(x.id);
          loadSettings(x.id);
        } else {
          toast(settoast, 'USUÁRIO OU SENHA INCORRETOS', 'rgb(231, 76, 60, 1)', 3000);
        }
      });
    }, 1000);
  }

  // forma mais inteligente de adicionar o token ao header de todas as requisições.
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    else
      delete axios.defaults.headers.common["Authorization"];
  }

  // inputs para login e senha.
  function Inputs() {
    return (
      <div style={{
        display: viewlistaunidades == 1 ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'USUÁRIO')}
          onChange={(e) => (user = e.target.value)}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SENHA')}
          onChange={(e) => { password = e.target.value; checkLogin() }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
      </div>
    )
  }

  // lista de unidades disponiveis para o usuário logado.
  const [viewlistaunidades, setviewlistaunidades] = useState(0);
  function ListaDeAcessos() {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          width: window.innerWidth > 425 ? '40vw' : '70vw',
          marginTop: 20
        }}
      >
        {acessos.map(item => (
          <div
            key={'ACESSO: ' + item.id_acesso}
            className='button' style={{ flex: 1 }}
            onClick={() => {
              sethospital(item.id_cliente);
              setunidade(item.id_unidade);
              setpagina(1);
              history.push('/passometro');
            }}
          >
            {unidades.filter(valor => valor.id_unidade == item.id_unidade).map(valor => valor.nome_cliente + ' - ' + valor.nome_unidade)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="main cor1 fadein"
      style={{
        display: pagina == 0 ? 'flex' : 'none',
        paddingTop: window.innerWidth < 426 ? 20 : '',
      }}>
      <Logo height={100} width={100}></Logo>
      <div className="text2" style={{ margin: 20, fontSize: 20 }}>PULSAR</div>
      <Inputs></Inputs>
      <ListaDeAcessos></ListaDeAcessos>
    </div>
  );
}

export default Login;