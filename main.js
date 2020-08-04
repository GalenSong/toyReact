import {ToyReact, Component} from './ToyReact'

class Square extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    componentWillMount() {
        console.log('Component WILL MOUNT!')

    }

    componentDidMount() {
        this.setState({
            value: 3
        })
    }

    componentWillUpdate() {
        console.log('Component WILL UPDATE!');
    }

    componentDidUpdate () {
        console.log('Component DID UPDATE!')
    }

    componentWillUnmount() {
        console.log('Component WILL UNMOUNT!')
    }

    render() {
        return (
        <button className="square" onClick={() => this.setState({value: 'X'})}>
            {this.state.value}
        </button>
        );
    }
}

class Board extends Component {
    renderSquare(i) {
        return <Square value={i} />;
    }

    render() {
        const status = 'Next player: X';
        return (
          <div>
            <div className="status">{status}</div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
      }
}

let a = <Board></Board>

ToyReact.render(
    a,
    document.body
)