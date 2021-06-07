import './styles/globals.css';
import AppRouter from './AppRouter';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <AppRouter />
      </div>
    </SnackbarProvider>
  );
}

export default App;
