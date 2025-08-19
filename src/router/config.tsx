
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Landing from "../pages/landing/page";
import OtpLogin from "../pages/otp-login/page";
import TestInstructions from "../pages/test-instructions/page";
import Test from "../pages/test/page";
import Payment from "../pages/payment/page";
import PaymentSuccess from "../pages/payment-success/page";
import PaymentPage from '../pages/payment/page';
import PaymentSuccessPage from '../pages/payment-success/page';
import TestPage from '../pages/test/page';
import TestInstructionsPage from '../pages/test-instructions/page';

// Admin Pages
import AdminLogin from '../pages/admin/login/page';
import AdminDashboard from '../pages/admin/dashboard/page';
import AdminQuestions from '../pages/admin/questions/page';
import AdminPayments from '../pages/admin/payments/page';
import AdminReports from '../pages/admin/reports/page';
import AdminTags from '../pages/admin/tags/page';
import AdminSettings from '../pages/admin/settings/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/otp-login',
    element: <OtpLogin />,
  },
  {
    path: '/test-instructions',
    element: <TestInstructions />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/payment',
    element: <Payment />,
  },
  {
    path: '/payment-success',
    element: <PaymentSuccess />,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/questions',
    element: <AdminQuestions />,
  },
  {
    path: '/admin/payments',
    element: <AdminPayments />,
  },
  {
    path: '/admin/reports',
    element: <AdminReports />,
  },
  {
    path: '/admin/tags',
    element: <AdminTags />,
  },
  {
    path: '/admin/settings',
    element: <AdminSettings />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
