import { createBrowserRouter } from "react-router-dom";

import { userRoutes } from "./userRoutes";
import { boardRoutes } from "./boardRoutes";

import Layout from "../shared/components/Layout/Layout";
import HomePage from "../features/home/pages/HomePage";

const appRouter = createBrowserRouter([
  {
    /* 전체 레이아웃 컴포넌트 */
    path: "/",
    element: <Layout/>,
    children: [
      /* 홈페이지 */
      {
        index: true,
        element: <HomePage/>
      },
      /* 인증 관련 라우터 */
      ...userRoutes,
      /* 게시판 관련 라우터 */
      ...boardRoutes,
    ]
  }
]);

export default appRouter;