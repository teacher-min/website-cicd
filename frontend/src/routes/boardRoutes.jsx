import { lazy } from "react";
import AuthCheckRoute from "../shared/components/AuthCheckRoute/AuthCheckRoute";

const BoardListPage = lazy(() => import("../features/board/pages/BoardListPage"));
const BoardCreatePage = lazy(() => import("../features/board/pages/BoardCreatePage"));
const BoardDetailPage = lazy(() => import("../features/board/pages/BoardDetailPage"));
const BoardEditPage = lazy(() => import("../features/board/pages/BoardEditPage"));

export const boardRoutes = [
  //----- 인증이 필요한 페이지 (로그인 필요)
  {
    path: "/boards",
    children: [
      //----- "/boards"
      {
        index: true,
        element: (
          <AuthCheckRoute>
            <BoardListPage/>
          </AuthCheckRoute>
        ),
      },
      //----- "/boards/create"
      {
        path: "create",
        element: (
          <AuthCheckRoute>
            <BoardCreatePage/>
          </AuthCheckRoute>
        ),
      },
      //----- /boards/123 (동적 라우팅)
      {
        path: ":bid",
        element: (
          <AuthCheckRoute>
            <BoardDetailPage/>
          </AuthCheckRoute>
        ),
      },
      //----- /boards/123/edit (동적 라우팅)
      {
        path: ":bid/edit",
        element: (
          <AuthCheckRoute>
            <BoardEditPage/>
          </AuthCheckRoute>
        ),
      }
    ],
  },
];