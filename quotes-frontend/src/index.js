import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import * as serviceWorker from './serviceWorker';
import './App.scss';

class QuoteBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            quotes: [],
            error: null,
            quoteIndex: 0,
            colorIndex: 0
        };
        this.changeQuote = this.changeQuote.bind(this);
    }
    componentDidMount() {
        // fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json')
        fetch('http://localhost:8080/api/quotes/')
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    quotes: result,
                    colorIndex: 1
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }
    componentDidUpdate(prevProps, prevState){
        const bgChange = document.getElementsByTagName('body');
        const colors = ["LightSkyBlue", "LightSalmon", "PaleTurquoise", "LightPink", "PaleGreen"];
        let color = colors[(prevState.colorIndex) % 5];
        for (let i = 0; i < bgChange.length; i++){
           bgChange[i].style.backgroundColor = color;
        }
    }
    changeQuote() {
        this.setState((prevState) => ({
            quoteIndex: Math.floor(Math.random() * this.state.quotes.length),
            colorIndex: prevState.colorIndex + 1
          }));
    }
    render(){
        const {isLoaded, quotes, error, quoteIndex} = this.state;
        if(error){
            return(<div>Error: {error.message}</div>);
        }
        else if (!isLoaded){
            return(<div>Loading...</div>);
        } else if(quotes.length === 0) {
            return(<div>No Quotes! :(</div>);
        }
        else {
            const quote = quotes[quoteIndex];
            const URIEncodedQuote = encodeURI(quote.quote + "\n - " + quote.author);
            return(
                <div id="quote-box" >
                    <ReactCSSTransitionReplace transitionName="fade-wait"
                    transitionEnterTimeout={1000} transitionLeaveTimeout={400}>
                    <div key={quoteIndex}>
                        <p id="text">{quote.quote}</p>
                        <p id="author">- {quote.author}</p>
                    </div>
                    </ReactCSSTransitionReplace>            
                    <a id="tweet-quote" href={'https://twitter.com/intent/tweet?text=' + URIEncodedQuote}
                     target="_blank" rel="noopener noreferrer">
                     <FontAwesomeIcon icon={faTwitter} /></a>
                    <button id="new-quote" onClick={this.changeQuote}>New Quote</button>
                </div>
            );
        }
    }
}

ReactDOM.render(<QuoteBox />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
