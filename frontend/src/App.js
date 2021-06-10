import './styles/globals.css';
import AppRouter from './AppRouter';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <AppRouter />
      </SnackbarProvider>
    </div>
  );
}

export default App;
