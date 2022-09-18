import { utils, BigNumber } from "ethers";
import React from "react";
import NetworkConfigInterface from "../../../../smart-contract/lib/NetworkConfigInterface";

interface Props {
  networkConfig: NetworkConfigInterface;
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  loading: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
  checkCost(amount: number): Promise<any>;
}

interface State {
  mintAmount: number;
  totalPrice: string;
}

const defaultState: State = {
  mintAmount: 3,
  totalPrice: '0'
};

const defaultCost: State = {
  mintAmount: 0.0055,
  totalPrice: '0'
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private async incrementMintAmount(): Promise<void> {
    console.log('price:', await this.props.checkCost(Math.min(
      this.props.maxMintAmountPerTx,
      this.state.mintAmount + 1
    )))
    this.setState({
      mintAmount: Math.min(
        this.props.maxMintAmountPerTx,
        this.state.mintAmount + 1
      ),
      totalPrice: (await this.props.checkCost(Math.min(
        this.props.maxMintAmountPerTx,
        this.state.mintAmount + 1
      ))).toString()
    });
  }

  private async decrementMintAmount(): Promise<void> {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
      totalPrice: (await this.props.checkCost(Math.max(1, this.state.mintAmount - 1))).toString()
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);
  }

  render() {
    return (
      <>
        {this.canMint() ? (
          <div
            className={`mint-widget ${this.props.loading
              ? "animate-pulse saturate-0 pointer-events-none"
              : ""
              }`}
          >
            <div className="preview">
              <img src="/build/images/preview.png" alt="Collection preview" />
            </div>

            <div className="price">
              <strong>Total price:</strong>{" "}
              {utils.formatEther(
                BigNumber.from(this.state.totalPrice)
              )}{" "}
              {this.props.networkConfig.symbol}
            </div>

            <div className="controls">
              <button
                className="decrease"
                disabled={this.props.loading}
                onClick={() => this.decrementMintAmount()}
              >
                -
              </button>
              <span className="mint-amount">{this.state.mintAmount}</span>
              <button
                className="increase"
                disabled={this.props.loading}
                onClick={() => this.incrementMintAmount()}
              >
                +
              </button>
              <button
                className="primary"
                disabled={this.props.loading}
                onClick={() => this.mint()}
              >
                Mint
              </button>
            </div>
          </div>
        ) : (
          <div className="cannot-mint">
            <span className="emoji">⏳</span>
            {this.props.isWhitelistMintEnabled ? (
              <>
                You are not included in the <strong>whitelist</strong>.
              </>
            ) : (
              <>
                The contract is <strong>paused</strong>.
              </>
            )}
            <br />
            Please come back during the next sale!
          </div>
        )}
      </>
    );
  }
}
