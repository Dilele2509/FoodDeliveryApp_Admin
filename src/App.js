import { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { publicRoutes } from './Routes';
import { DefaultLayout, AdminDefault } from './components/Layout';

//for private routes
import axios from './API/axios';
import { privateRoutes } from './Routes';

function App() {
  const [role_id, setRoleId] = useState(null)
  useEffect(() => {
    // check user login status when the component mounts
    const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
      }
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/login/check-status/', config);
        const { status } = response.data;

        console.log(status);
  
        if (status) {
          const roleResponse= await axios.get('user/id/', config);
          //console.log(roleResponse.data.user[0].role_id);
          setRoleId(roleResponse.data.user[0].role_id);

        }else{
          console.log('no logged in yet');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
  
    checkLoginStatus();
  }, []);
  return (
    <Router>
      <div className="App blankPage">
      {console.log(role_id)}
        {role_id === 2 ? (
          <Routes>
            {privateRoutes.map((route, index)=> {
              const Page = route.component;

              let Layout = AdminDefault;
              if(route.layout){
                Layout = route.layout;
              }else if(route.layout === null){
                Layout = Fragment;
              }

              return (
                <Route 
                  key={index} 
                  path={route.path} 
                  element = {
                    <Layout>
                      <Page/>
                    </Layout>
                  }     
                />);
            })}
          </Routes>
        ) : (
          <Routes>
            {publicRoutes.map((route, index)=> {
              const Page = route.component;

              let Layout = DefaultLayout;
              if(route.layout){
                Layout = route.layout;
              }else if(route.layout === null){
                Layout = Fragment;
              }

              return (
                <Route 
                  key={index} 
                  path={route.path} 
                  element = {
                    <Layout>
                      <Page/>
                    </Layout>
                  }     
                />);
            })}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
