import React from "react";
import browser from "webextension-polyfill";

import utils from "../../../common/lib/utils";
import { getFiatFromSatoshi } from "../../../common/utils/helpers";

import Appbar from "../../components/Appbar";
import Transactions from "../../components/Transactions";
import Loading from "../../components/Loading";
import BalanceCard from "../../components/BalanceCard";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alias: "",
      currency: "USD",
      balance: null,
      balanceFiat: null,
      transactions: {},
      loadingTransactions: true,
    };
  }
  get exchangeRate() {
    if (!this.state.balance) return null;
    return (this.state.balanceFiat / this.state.balance) * 100000000;
  }

  componentDidMount() {
    browser.storage.sync.get(["currentAccount"]).then((result) => {
      this.setState({ currentAccount: result.currentAccount });
    });
    utils.call("getInfo").then((info) => {
      console.log("info", info);
      this.setState({ alias: info?.alias });
    });
    utils.call("getTransactions").then((result) => {
      console.log(result);
      this.setState({
        transactions: result?.payments,
        loadingTransactions: false,
      });
    });
    utils.call("getBalance").then(async (result) => {
      this.setState({ balance: result?.balance });
      this.setState({
        balanceFiat: await getFiatFromSatoshi(
          this.state.currency,
          result.balance
        ),
      });
    });
  }

  render() {
    const { alias, balance, balanceFiat, transactions } = this.state;

    return (
      <div>
        <Appbar
          title={alias}
          subtitle="₿0.0016 7930 €33.57"
          onOptionsClick={() => {
            return utils.openPage("options.html");
          }}
        />
        <div className="p-5 border-b-4 border-gray-200">
          <BalanceCard
            alias="Wallet name"
            crypto={balance && `₿${balance}`}
            fiat={balanceFiat && `$${balanceFiat}`}
          />
        </div>
        <div className="p-5">
          <h2 className="text-xl">Transactions</h2>
          {this.state.loadingTransactions ? (
            <div className="pt-4 flex justify-center">
              <Loading />
            </div>
          ) : (
            <Transactions
              exchangeRate={this.exchangeRate}
              transactions={transactions}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
