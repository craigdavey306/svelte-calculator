<script lang="ts">
  import type { OperationToken, KeypadButton } from '../types';
  import { KEYPAD_BUTTONS, ZERO_FRACTION, OPERATORS } from '../constants';
  import { calculate, expressionFormatter } from '../util/calculate';

  let resultDisplay = '';
  let isDisplayingResults = false;
  let selectedOperation: OperationToken | '' = '';
  let leftOperand = '';
  let rightOperand = '';
  let expressionStr = '';
  let result = 0;

  const handleClear = () => {
    selectedOperation = '';
    resultDisplay = '';
    leftOperand = '';
    rightOperand = '';
    expressionStr = '';
    result = 0;
    isDisplayingResults = false;
  };

  const handleOperationClick = (operation: OperationToken) => {
    if (!leftOperand) return;

    if (operation === '=') {
      if (!rightOperand || !selectedOperation) return;

      expressionStr = expressionFormatter(
        leftOperand,
        rightOperand,
        selectedOperation
      );

      const numericResult = calculate(expressionStr);
      resultDisplay = numericResult.toString();
      leftOperand = resultDisplay; // set leftOperand to the new results for additional calculations.
      rightOperand = '';
    }

    selectedOperation = operation;
  };

  const handleKeypadBtnClick = (keyPressed: KeypadButton) => {
    if (isDisplayingResults) {
      handleClear();
    }

    if (!resultDisplay && keyPressed === '0') return;

    if (keyPressed === '.' && resultDisplay.includes('.')) return;

    if (!selectedOperation) {
      if (!resultDisplay && keyPressed == '.') {
        leftOperand = ZERO_FRACTION;
        return (resultDisplay = leftOperand);
      }

      leftOperand += keyPressed; // string concatenation
      return (resultDisplay = leftOperand);
    } else {
      if (!rightOperand) {
        resultDisplay = '';
      }

      if (keyPressed === '.') {
        rightOperand = ZERO_FRACTION;
        return (resultDisplay = rightOperand);
      }

      rightOperand += keyPressed;
      resultDisplay = rightOperand;
    }
  };
</script>

<main>
  <div class="calculator">
    <div
      class={`results ${
        resultDisplay.length >= 12 ? 'results-sm' : 'results-lg'
      }`}
    >
      {resultDisplay}
    </div>
    <div class="digits">
      <div class="numbers">
        <button class="btn btn-xlg" on:click={handleClear}> C </button>
        {#each KEYPAD_BUTTONS as key (key)}
          <button
            class={`btn ${key === '0' ? 'btn-lg' : ''}`}
            on:click={() => handleKeypadBtnClick(key)}>{` ${key} `}</button
          >
        {/each}
      </div>
      <div class="operations">
        {#each OPERATORS as operator (operator)}
          <button
            class={`btn btn-${
              operator === selectedOperation ? 'silver' : 'orange'
            }`}
            on:click={() => handleOperationClick(operator)}
            >{` ${operator} `}</button
          >
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calculator {
    background-color: rgb(28, 28, 28);
    width: 240px;
    padding: 15px;
    border-radius: 7px;
  }

  .digits {
    display: flex;
  }

  .operations {
    display: flex;
    flex-direction: column;
  }

  .numbers {
    display: flex;
    flex-wrap: wrap;
    width: 200px;
  }

  .btn {
    width: 50px;
    height: 50px;
    border-radius: 100px;
    background-color: rgb(114, 113, 113);
    font-size: 20px;
    font-weight: bold;
    color: white;
    margin: 5px;
    border: none;
  }

  .btn-lg {
    width: 110px;
  }

  .btn-orange {
    background-color: orange;
  }

  .btn-silver {
    background-color: silver;
  }

  .btn-xlg {
    width: 170px;
  }

  .results {
    height: 60px;
    color: white;
    display: flex;
    flex-direction: row-reverse;
    margin-right: 10px;
  }

  .results-lg {
    font-size: 50px;
  }

  .results-sm {
    font-size: 25px;
  }
</style>
