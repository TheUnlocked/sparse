import SExpression from "./sexpr";
import { TokenType, BracketDirection, BracketShape, tokenize } from "./tokenizer";

export const parse = (input: string): SExpression => {
    let bracketStack: BracketShape[] = [];
    let sexprStack: SExpression[] = [];
    let originalSexpr: SExpression = new SExpression();
    let currentSexpr: SExpression = originalSexpr;
    let errorList: {pos: {row: number, col: number}, message: string}[] = [];
    for(let token of tokenize(input)){
        try{
            if (token.type === TokenType.Bracket){
                let bracket: {shape: BracketShape, dir: BracketDirection} = token.value;
                if (bracket.dir === BracketDirection.Start){
                    bracketStack.push(bracket.shape);
                    if (currentSexpr.head !== undefined){
                        currentSexpr.tail = new SExpression();
                        currentSexpr = currentSexpr.tail;
                    }
                    currentSexpr.head = new SExpression();
                    sexprStack.push(currentSexpr);
                    currentSexpr = currentSexpr.head;
                }
                else{
                    if (bracketStack[bracketStack.length-1] !== bracket.shape){
                        errorList.push({pos: token.positionInfo, message: "Mismatched closing bracket."});
                        while (bracketStack.length > 0 && bracketStack.pop() !== bracket.shape){
                            currentSexpr.tail = null;
                            currentSexpr = sexprStack.pop()!;
                        }
                    }
                    currentSexpr.tail = null;
                    currentSexpr = sexprStack.pop()!;
                    if (currentSexpr === undefined){
                        errorList.push({pos: token.positionInfo, message: "Missing closing bracket."});
                    }
                }
            }
            else if (token.type === TokenType.Name){
                if (currentSexpr.head !== undefined){
                    currentSexpr.tail = new SExpression();
                    currentSexpr = currentSexpr.tail;
                }
                currentSexpr.head = token.value;
            }
        }
        catch(e){
            console.error(e);
        }
    }
    currentSexpr.tail = null;
    console.error(errorList.map(x => `${x.pos.row}, ${x.pos.col}: ${x.message}`).join("\n"));
    return originalSexpr;
}