import HomePage from "../views/Home";
import HomeIcon from "@material-ui/icons/Home";

import LoginPage from '../views/Login';
import LoginIcon from '@material-ui/icons/PeopleAltOutlined';

import RegisterPage from '../views/Register';
import ProfileCanPage from '../views/ProfileCandidate';
import HomeRecruPage from '../views/HomeRecruiter';
import CanInfoPage from '../views/CanInfo';
import NewPostPage from '../views/NewPost';
import InfoPostPage from '../views/InfoPost';
import RecruInfoPage from '../views/RecruInfo';
import DashBoardPage from '../views/DashBoard';

const NEDRoutes = {
    New: "new",
    Detail: ":id"
}

export const PublicRouteNames = {
    Home: '',
    Login: 'Login',
    Register: 'Register',

    HomeRecruiter: 'HomeRecruiter',
    CanInfo: 'CanInfo',
    NewPost: 'NewPost',
    PostDetail: 'PostDetail',

    ProfileCan: 'ProfileCan',
    InfoPost: 'InfoPost',
    RecruInfo: 'RecruInfo',

    DashBoard: 'DashBoard',
}

export const AllRouteNames = {
    ...PublicRouteNames
}

export const RoutePaths = {
    Home: ['', PublicRouteNames.Home].join('/'),
    Login: ['', PublicRouteNames.Login].join('/'),
    Register: ['', PublicRouteNames.Register].join('/'),

    HomeRecruiter: ['', PublicRouteNames.HomeRecruiter].join('/'),
    CanInfo: ['', PublicRouteNames.CanInfo, NEDRoutes.Detail].join('/'),
    NewPost: ['', PublicRouteNames.NewPost, NEDRoutes.New].join('/'),
    PostDetail: ['', PublicRouteNames.PostDetail, NEDRoutes.Detail].join('/'),

    ProfileCan: ['', PublicRouteNames.ProfileCan].join('/'),
    InfoPost: ['', PublicRouteNames.InfoPost, NEDRoutes.Detail].join('/'),
    RecruInfo: ['', PublicRouteNames.RecruInfo, NEDRoutes.Detail].join('/'),

    DashBoard: ['', PublicRouteNames.DashBoard].join('/'),
}

export const PublicRoutes = {
    Home: {
        exact: true,
        id: PublicRouteNames.Home,
        path: RoutePaths.Home,
        component: HomePage,
        icon: HomeIcon
    },
    Login: {
        exact: true,
        id: PublicRouteNames.Login,
        label: "Login label",
        path: RoutePaths.Login,
        component: LoginPage,
        icon: LoginIcon
    },
    Register: {
        exact: true,
        id: PublicRouteNames.Register,
        path: RoutePaths.Register,
        component: RegisterPage,
        icon: LoginIcon
    },
    InfoPost: {
        exact: true,
        id: PublicRouteNames.InfoPost,
        path: RoutePaths.InfoPost,
        component: InfoPostPage,
        icon: LoginIcon
    },
    // DashBoard: {
    //     exact: true,
    //     id: PublicRouteNames.DashBoard,
    //     path: RoutePaths.DashBoard,
    //     component: DashBoardPage,
    // },
}

export const CandidateRoutes = {
    Home: {
        exact: true,
        id: PublicRouteNames.Home,
        label: "Home",
        path: RoutePaths.Home,
        component: HomePage,
        icon: HomeIcon
    },
    // Login: {
    //     exact: true,
    //     id: PublicRouteNames.Login,
    //     label: "Login label",
    //     path: RoutePaths.Login,
    //     component: LoginPage,
    //     icon: LoginIcon
    // },
    // Register: {
    //     exact: true,
    //     id: PublicRouteNames.Register,
    //     label: "Register label",
    //     path: RoutePaths.Register,
    //     component: RegisterPage,
    //     icon: LoginIcon
    // },
    ProfileCanPage: {
        exact: true,
        id: PublicRouteNames.ProfileCan,
        label: "Profile can label",
        path: RoutePaths.ProfileCan,
        component: ProfileCanPage,
        icon: LoginIcon
    },
    InfoPost: {
        exact: true,
        id: PublicRouteNames.InfoPost,
        label: "Profile can label",
        path: RoutePaths.InfoPost,
        component: InfoPostPage,
        icon: LoginIcon
    },
    RecruInfo: {
        exact: true,
        id: PublicRouteNames.RecruInfo,
        label: "Profile can label",
        path: RoutePaths.RecruInfo,
        component: RecruInfoPage,
    },
}

export const RecruiterRoutes = {
    Home: {
        exact: true,
        id: PublicRouteNames.Home,
        label: "Home",
        path: RoutePaths.Home,
        component: HomePage,
        icon: HomeIcon
    },
    // Login: {
    //     exact: true,
    //     id: PublicRouteNames.Login,
    //     label: "Login label",
    //     path: RoutePaths.Login,
    //     component: LoginPage,
    //     icon: LoginIcon
    // },
    // Register: {
    //     exact: true,
    //     id: PublicRouteNames.Register,
    //     label: "Register label",
    //     path: RoutePaths.Register,
    //     component: RegisterPage,
    //     icon: LoginIcon
    // },
    HomeRecruiter: {
        exact: true,
        id: PublicRouteNames.HomeRecruiter,
        label: "Home recruiter label",
        path: RoutePaths.HomeRecruiter,
        component: HomeRecruPage,
        icon: LoginIcon
    },
    CanInfo: {
        exact: true,
        id: PublicRouteNames.CanInfo,
        label: "Info Candidate page",
        path: RoutePaths.CanInfo,
        component: CanInfoPage,
        icon: LoginIcon
    },
    NewPost: {
        exact: true,
        id: PublicRouteNames.NewPost,
        label: "Info Candidate page",
        path: RoutePaths.NewPost,
        component: NewPostPage,
        icon: LoginIcon
    },
    PostDetail: {
        exact: true,
        id: PublicRouteNames.PostDetail,
        label: "Info Candidate page",
        path: RoutePaths.PostDetail,
        component: NewPostPage,
        icon: LoginIcon
    },
    InfoPost: {
        exact: true,
        id: PublicRouteNames.InfoPost,
        label: "Profile can label",
        path: RoutePaths.InfoPost,
        component: InfoPostPage,
        icon: LoginIcon
    },
    RecruInfo: {
        exact: true,
        id: PublicRouteNames.RecruInfo,
        label: "Profile can label",
        path: RoutePaths.RecruInfo,
        component: RecruInfoPage,
    },
}

export const AdminRoutes = {
    RecruInfo: {
        exact: true,
        id: PublicRouteNames.RecruInfo,
        label: "Profile can label",
        path: RoutePaths.RecruInfo,
        component: RecruInfoPage,
    },
    Home: {
        exact: true,
        id: PublicRouteNames.Home,
        path: RoutePaths.Home,
        component: HomePage,
        icon: HomeIcon
    },
    InfoPost: {
        exact: true,
        id: PublicRouteNames.InfoPost,
        path: RoutePaths.InfoPost,
        component: InfoPostPage,
        icon: LoginIcon
    },
    DashBoard: {
        exact: true,
        id: PublicRouteNames.DashBoard,
        path: RoutePaths.DashBoard,
        component: DashBoardPage,
    },
}