import { useState,useEffect } from 'react';
import '../styles/login.css';
import { useNavigate} from 'react-router-dom';
import { useStoreActions,useStoreState } from 'easy-peasy';


const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ userCredentials, setUserCredentials] = useState([])
  const navigate = useNavigate();
  
  const manageUserTableData = useStoreState(
    (state) => state.manageUserTableData
  );
  const usersList = useStoreState(
    (state) => state.usersList
  );
  
  const getUserTableData = useStoreActions(
    (actions) => actions.getUserTableData
    );
    
    useEffect(() => {
      getUserTableData();
      
    }, [])
    
    
    useEffect(() => {
      if (manageUserTableData.tabaleData) {
      setUserCredentials(manageUserTableData.tabaleData)
    }
  }, [manageUserTableData.tabaleData]);

 
  

  // const userCredentials = [
  //   { uname: 'u2', pswrd: '2' },
  //   { uname: 'u1', pswrd: '1' },
    
  // ];

  const isValidCredentials = userCredentials.some(
    ({ user_name, password }) => user_name === username && password === password
  );
  

  const handleLogin = () => {
    if (username === 'a' && password === '1') {
      localStorage.setItem("token", 'admin')
      navigate('/', { replace: true });
      setError('');
    }else if(isValidCredentials){
      localStorage.setItem("token", 'user')
      navigate('/sales-manager-home', { replace: true });
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

 
  

  return (
    <div className="login-container">
    <div className="login-form">
      <h2 className="login-title">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="error-message">{error}</div>}
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  </div>
);
};

export default Login;
