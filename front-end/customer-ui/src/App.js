import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Layout from "./layouts";
import {
  PublicRoutes, RoutePaths, PublicRouteNames,
  CandidateRoutes, RecruiterRoutes, AdminRoutes
} from "./routes/public-route";
import { getAuthLS, LS_KEY, clearAuthLS } from '../src/helpers/localStorage';
import cookies from 'react-cookies';

function App() {
  // const loggedIn = true;
  let loggedIn = getAuthLS(LS_KEY.AUTH_TOKEN) ? true : false;
  const check = getAuthLS(LS_KEY.AUTH_TOKEN)
  if (cookies.load("user") == null || !loggedIn) {
    loggedIn = false;
    clearAuthLS();
    cookies.remove("user");
    cookies.remove("access_token");
  };

  function GuestLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(PublicRoutes).map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  function CandidateLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(CandidateRoutes).map((route, idx) => {
            return (
              <Route
                key={idx + route.id}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  function RecruiterLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(RecruiterRoutes).map((route, idx) => {
            return (
              <Route
                key={idx + route.id}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  function AdminLayout(props) {
    return (
      <Layout {...props}>
        <Switch>
          {Object.values(AdminRoutes).map((route, idx) => {
            return (
              <Route
                key={idx + route.id}
                path={route.path}
                exact={route.exact}
                render={(props) => <route.component {...props} />}
              />
            );
          })}
          <Redirect to={RoutePaths.Home} />
        </Switch>
      </Layout>
    );
  }

  const rolePaths = {
    UNG_VIEN: 'UNG VIEN',
    TUYEN_DUNG: 'TUYEN DUNG',
    QUAN_LY: 'QUAN LY',
  }

  function ManageRoute({ role }) {
    if (role === rolePaths.UNG_VIEN) {
      return (
        <Route key={1} path="/" render={(props) => <CandidateLayout {...props} />} />
      );
    } else if (role === rolePaths.TUYEN_DUNG) {
      return (
        <Route key={2} path="/" render={(props) => <RecruiterLayout {...props} />} />
      );
    } else {
      return (
        <Route key={3} path="/" render={(props) => <AdminLayout {...props} />} />
      );
    }
  }

  return (
    <Router>
      {loggedIn ? (
        <Switch>
          <ManageRoute role={check} />
        </Switch>
      ) : (
        <Switch>
          <Route key={0} path="/" render={(props) => <GuestLayout {...props} />} />
        </Switch>
      )}
    </Router>
  );
}
export default App;
