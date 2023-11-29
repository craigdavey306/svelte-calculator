import type { OperationToken } from '../types';

interface BinaryOperation {
  left: number;
  right: number;
  perform: () => number;
}

class AdditionOperation implements BinaryOperation {
  constructor(public left: number, public right: number) {}

  perform(): number {
    return this.left + this.right;
  }
}

class SubtractionOperation implements BinaryOperation {
  constructor(public left: number, public right: number) {}

  perform(): number {
    return this.left - this.right;
  }
}

class MultiplicationOperation implements BinaryOperation {
  constructor(public left: number, public right: number) {}

  perform(): number {
    return this.left * this.right;
  }
}

class DivisionOperation implements BinaryOperation {
  constructor(public left: number, public right: number) {}

  perform(): number {
    return this.left / this.right;
  }
}

class Calculator {
  public static calculate(operation: BinaryOperation): number {
    return operation.perform();
  }
}

/**
 * Transforms an arithmetic string expression into a binary operation instance.
 * @param input
 * @returns
 */
function operationFactory(input: string): BinaryOperation | null {
  const regexBinaryOp = /(?<left>\d+\.*\d*)(?<op>[+-x\/])(?<right>\d+\.*\d*)/g;
  for (const match of input.matchAll(regexBinaryOp)) {
    if (match.groups) {
      const left = parseFloat(match.groups.left);
      const right = parseFloat(match.groups.right);

      switch (match.groups.op as Omit<OperationToken, '='>) {
        case '-':
          return new SubtractionOperation(left, right);
        case 'x':
          return new MultiplicationOperation(left, right);
        case '/':
          return new DivisionOperation(left, right);
        default:
          return new AdditionOperation(left, right);
      }
    }
  }

  return null;
}

/**
 * Calculates a numeric value based on an expression string such as 1+2.
 * @param inputExpression
 * @returns number
 */
export function calculate(inputExpression: string): number {
  const op = operationFactory(inputExpression);
  if (!op) return Number.NaN;

  return op.perform();
}

/**
 * Formats an arithmetic string that can be used for calculating an expression.
 * @param left
 * @param right
 * @param operation
 * @returns
 */
export function expressionFormatter(
  left: string,
  right: string,
  operation: OperationToken
) {
  return `${left}${operation}${right}`;
}
