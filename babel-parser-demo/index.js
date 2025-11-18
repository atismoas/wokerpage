import parser from "@babel/parser"
import traverse from "@babel/traverse"
import generator from "@babel/generator"

const code = "let i = 888"

const ast = parser.parse(code);


// 通过parser获取转换的ast 抽象语法树
// originast = JOSN.stringify(ast)
const originAst = { "type": "File", "start": 0, "end": 12, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 12, "index": 12 } }, "errors": [], "program": { "type": "Program", "start": 0, "end": 12, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 12, "index": 12 } }, "sourceType": "script", "interpreter": null, "body": [{ "type": "VariableDeclaration", "start": 0, "end": 12, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 12, "index": 12 } }, "declarations": [{ "type": "VariableDeclarator", "start": 4, "end": 11, "loc": { "start": { "line": 1, "column": 4, "index": 4 }, "end": { "line": 1, "column": 11, "index": 11 } }, "id": { "type": "Identifier", "start": 4, "end": 5, "loc": { "start": { "line": 1, "column": 4, "index": 4 }, "end": { "line": 1, "column": 5, "index": 5 }, "identifierName": "i" }, "name": "i" }, "init": { "type": "NumericLiteral", "start": 8, "end": 11, "loc": { "start": { "line": 1, "column": 8, "index": 8 }, "end": { "line": 1, "column": 11, "index": 11 } }, "extra": { "rawValue": 888, "raw": "888" }, "value": 888 } }], "kind": "let" }], "directives": [] }, "comments": [] }

console.log(ast);

const visit = {
    // 访问哪个节点，就将哪个节点放进来
    VariableDeclaration(path) {
        if (path.node.kind === "let") {
            path.node.kind = "const";
        }
    }
}

// 游历代码，访问定义的节点
traverse.default(ast, visit);
console.log(ast);

//生成代码
const res = generator.default(ast, {}, code)
console.log(res.code)



