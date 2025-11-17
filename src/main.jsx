import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD

import {Provider} from "react-redux"
import {store} from "./redux/store.js"
=======
import 'flowbite';
>>>>>>> a0ff0f0880f16d1edb13bead9f63d14e48577c5a


createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
=======
    <App />
  </StrictMode>,
)
>>>>>>> a0ff0f0880f16d1edb13bead9f63d14e48577c5a
