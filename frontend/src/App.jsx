import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import store from "./store";
import LoadingSpinner from "./shared/components/UI/LoadingSpinner/LoadingSpinner";
import appRouter from "./routes/appRouter";

// 순환 참조 방지를 위해 axiosConfig.js 파일에 store 전달
import { setStore } from "./shared/api/axiosConfig";
setStore(store);

function App() {
  return (
    <Provider store={store}>
      {/* Suspense로 Lazy 컴포넌트 감싸기 */}
      <Suspense fallback={<LoadingSpinner/>}>
        <RouterProvider router={appRouter}/>
      </Suspense>
    </Provider>
  );
}

export default App;
