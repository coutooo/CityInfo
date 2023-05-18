// pages/index.js
import TextBox from './components/TextBox';

const BlockchainPage = () => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Blockchain API</h1>
          <TextBox />
        </div>
      </div>
    </div>
  );
};

export default BlockchainPage;
