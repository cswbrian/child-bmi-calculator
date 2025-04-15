import { HashRouter } from 'react-router-dom';
import ChildHealthCalculator from './components/ChildHealthCalculator';

const App = () => {
  return (
    <HashRouter>
      <div>
        <ChildHealthCalculator />
      </div>
    </HashRouter>
  );
};

export default App;
