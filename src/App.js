import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const addition = (accumulator, currentValue) => accumulator + currentValue;
const subtraction = (accumulator, currentValue) => accumulator - currentValue;
const multiplication = (accumulator, currentValue) => accumulator * currentValue;
const division = (accumulator, currentValue) => accumulator / currentValue;

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'numberPressed',                  
                  currentNumber: undefined,                  
                  currentOperation: undefined,
                  result: undefined};    
    this.inputNumber = this.inputNumber.bind(this);
    this.doOperation = this.doOperation.bind(this);
    this.showFinalResult = this.showFinalResult.bind(this);
    this.allClean = this.allClean.bind(this);        
  }
  
  inputNumber(newNumber) {    
    const displayLength = 14;
    let currentNumber = this.state.currentNumber;    
    if (currentNumber === undefined || this.state.mode === 'operatorPressed') {
      currentNumber = newNumber;
    } else {
      if (currentNumber.length < displayLength) {
        currentNumber += newNumber;
      }      
    }       
    this.setState({
      mode: 'numberPressed',
      currentNumber: currentNumber
    });      
  }  
  
  doOperation(currentOperation) {
    // what has to happen, if I press operator two times (or more) in a row    
    if (this.state.currentNumber === undefined && currentOperation === subtraction) {
      this.inputNumber('-');  
      this.setState({
        mode: 'numberPressed'      
      });      
    } else {
      let result = this.state.result;
      let operation = this.state.currentOperation;      
      if (result === undefined || operation === undefined) {
        result = this.state.currentNumber;      
      } else if (result !== undefined && operation !== undefined) {
        let prevNum = result; 
        prevNum = parseInt(prevNum, 10);
        let currNum = this.state.currentNumber;
        currNum = parseInt(currNum, 10); 
        result = [prevNum, currNum].reduce(operation);        
        result = result.toString();
      }      
      operation = currentOperation;
      this.setState({
        mode: 'operatorPressed',
        currentOperation: operation,
        result: result
      });   
    }      
  }

  showFinalResult() {    
    this.doOperation(undefined);
    let finalResult = this.state.result;
    this.setState({       
      currentNumber: finalResult      
    });
  }
  
  allClean() {    
    this.setState({
      mode: 'numberPressed',
      currentNumber: undefined,     
      result: undefined
    });    
  }
   
  render () {    
    return (
      <div className="calculator">
        <p>Calculator</p>
        <Display mode={this.state.mode} number={this.state.currentNumber} result={this.state.result}/>
        <div className="calc-pannel grid-container">
          <Number onClick={this.inputNumber}>7</Number>        
          <Number onClick={this.inputNumber}>8</Number>
          <Number onClick={this.inputNumber}>9</Number>
          <Button onClick={this.doOperation} operation={division}>&#247;</Button>
          <Button onClick={this.allClean}>AC</Button>
          <Number onClick={this.inputNumber}>4</Number>
          <Number onClick={this.inputNumber}>5</Number>
          <Number onClick={this.inputNumber}>6</Number> 
          <Button onClick={this.doOperation} operation={multiplication}>&#215;</Button>
          <Button>CE</Button>
          <Number onClick={this.inputNumber}>1</Number>
          <Number onClick={this.inputNumber}>2</Number>
          <Number onClick={this.inputNumber}>3</Number>
          <Button onClick={this.doOperation} operation={addition}>+</Button>
          <Button className="grid-item equal-sign"><p>=</p></Button>
          <Number onClick={this.inputNumber}>0</Number>
          <Number onClick={this.inputNumber}>00</Number>
          <Number onClick={this.inputNumber}>.</Number>
          <Button onClick={this.doOperation} operation={subtraction}>-</Button>                  
        </div>
      </div>
    );    
  }    
}

class Display extends Component {    
  render() {
    let outputStyle;
    let displayMode = this.props.mode;
    let displayOutput;
    if (displayMode === 'numberPressed') {      
      outputStyle = {color: 'black'};
      if (this.props.number === undefined) {
        displayOutput = '0';
      } else {
        displayOutput = this.props.number;
      }      
    } else {      
      outputStyle = {
        animationName: 'pressing-operator',
        animationDuration: '0.1s'
      };
      displayOutput = this.props.result;
    }    
    return(
      <div className="calc-display">
        <p id="p1" style={outputStyle}>{displayOutput}</p>        
      </div>      
    );
  }
}



class Button extends Component {   
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }  
  handleClick() {
    this.props.onClick(this.props.operation);
  }  
  render() {
    return <div className={this.props.className} onClick={this.handleClick}>{this.props.children}</div>;
  }
}
Button.defaultProps = {className: "grid-item"};



class Number extends Component {
  constructor(props) {
    super(props);    
    this.handleInput = this.handleInput.bind(this);    
  }  
  handleInput() {    
    const number = this.props.children;
    this.props.onClick(number);
  }
  render() {
    return <div className={this.props.className} onClick={this.handleInput}>{this.props.children}</div>;
  }
}
Number.defaultProps = {className: "grid-item"};

export default Calculator;