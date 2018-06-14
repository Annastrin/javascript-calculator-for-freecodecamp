import React, { Component } from 'react';
import './App.css';

const addition = (accumulator, currentValue) => accumulator + currentValue;
const subtraction = (accumulator, currentValue) => accumulator - currentValue;
const multiplication = (accumulator, currentValue) => accumulator * currentValue;
const division = (accumulator, currentValue) => accumulator / currentValue;

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'numberPressed',
                  decimal: false,                  
                  currentNumber: undefined,                  
                  currentOperation: undefined,
                  result: undefined};    
    this.inputNumber = this.inputNumber.bind(this);
    this.inputDecimalPoint = this.inputDecimalPoint.bind(this);
    this.doOperation = this.doOperation.bind(this);
    this.showFinalResult = this.showFinalResult.bind(this);
    this.allClean = this.allClean.bind(this); 
    this.clearEntry = this.clearEntry.bind(this);       
  }
  
  inputNumber(newNumber) {    
    const displayLength = 14;
    let currentNumber = this.state.currentNumber;    
    if ((currentNumber === undefined || currentNumber === '0' || this.state.mode === "operatorPressed") && !(newNumber === '0' || newNumber === '00')) {
      currentNumber = newNumber;
    } else if ((currentNumber === undefined || currentNumber === '0' || this.state.mode === "operatorPressed") && (newNumber === '0' || newNumber === '00')) {
      currentNumber = '0';
    } else {
      if (currentNumber.length < displayLength) {
        currentNumber = newNumber === '00' && currentNumber.length === 13 ? currentNumber + '0' : currentNumber + newNumber;
      }      
    }       
    this.setState({
      mode: 'numberPressed',
      currentNumber: currentNumber      
    });      
  }
  
  inputDecimalPoint() {
    if (this.state.decimal === true) {
      this.setState({
        mode: "numberPressed"              
      });      
    } else {
      if (this.state.currentNumber === undefined || this.state.currentNumber === '0' || this.state.mode === "operatorPressed") {
        this.inputNumber("0.");
      } else {
        this.inputNumber(".");
      }      
      this.setState({
        decimal: true              
      });
    }
  }
  
  doOperation(currentOperation) {        
    if (this.state.currentNumber === undefined && currentOperation === subtraction) { // если первой кнопкой нажат минус
      this.inputNumber('-');            
    } else if (this.state.currentNumber === "-" && // если минус нажат первой кнопкой несколько раз
      currentOperation === subtraction) {
      this.setState({
        mode: "numberPressed"              
      });
    } else if (this.state.mode === "operatorPressed") { // если оператор уже был нажат
      if (this.state.currentOperation !== currentOperation) { // и сейчас нажат другой оператор
        this.setState({
          mode: "operatorPressed",
          currentOperation: currentOperation, // то запомни новый оператор
        });
      }                  
    } else {
      let result = this.state.result;
      let operation = this.state.currentOperation;      
      if (result === undefined && operation === undefined) {
        result = this.state.currentNumber || '0';      
      } else if (result !== undefined && operation !== undefined) {        
        let prevNum = result;         
        prevNum = parseFloat(prevNum);        
        let currNum = this.state.currentNumber;         
        currNum = parseFloat(currNum);
        result = [prevNum, currNum].reduce(operation);
        if (result > 99999999999999) {
          result = result.toExponential(4);
        } else {
          result = result.toString();
        }          
      } else {
        result = this.state.currentNumber;
      }     
      operation = currentOperation;
      this.setState({
        mode: 'operatorPressed',
        decimal: false,
        currentOperation: operation,
        result: result
      });   
    }      
  }

  showFinalResult() {    
    this.doOperation(undefined);    
  }
  
  allClean() {    
    this.setState({
      mode: 'numberPressed',
      decimal: false,
      currentNumber: undefined,
      currentOperation: undefined,     
      result: undefined
    });    
  }

  clearEntry() {
    if (this.state.mode === 'numberPressed') {      
      let currentNumber = this.state.currentNumber;
      let newNumber;
      if (currentNumber !== undefined && currentNumber.length > 1) {
        newNumber = currentNumber.slice(0, -1);        
      } else {
        newNumber = undefined;
      }
      this.setState({
        currentNumber: newNumber
      });
    } else { 
      this.allClean();      
    }
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
          <Button onClick={this.clearEntry}>CE</Button>
          <Number onClick={this.inputNumber}>1</Number>
          <Number onClick={this.inputNumber}>2</Number>
          <Number onClick={this.inputNumber}>3</Number>
          <Button onClick={this.doOperation} operation={addition}>+</Button>
          <Button onClick={this.showFinalResult} className="grid-item equal-sign"><p>=</p></Button>
          <Number onClick={this.inputNumber}>0</Number>
          <Number onClick={this.inputNumber}>00</Number>
          <Number onClick={this.inputDecimalPoint}>.</Number>
          <Button onClick={this.doOperation} operation={subtraction}>-</Button>                  
        </div>
      </div>
    );    
  }    
}

class Display extends Component {    
  render() {    
    let displayMode = this.props.mode;
    let displayOutput;
    if (displayMode === 'numberPressed') {      
      if (this.props.number === undefined) {
        displayOutput = '0';
      } else {
        displayOutput = this.props.number;
      }      
    } else {        
      displayOutput = this.props.result;
      if (displayOutput === undefined) {
        displayOutput = '0';
      } else if (displayOutput.length > 14) {
        displayOutput = displayOutput.slice(0, 14);
      }
    }    
    return(
      <div className="calc-display">
        <p id="p1">{displayOutput}</p>        
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