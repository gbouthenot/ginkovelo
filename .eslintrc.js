module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "env": {
        "browser": true,
        "node": true,
        "jasmine": true
    },
    "rules": {
        "class-methods-use-this": ["off"],
        "max-len": ["warn", 109, { "ignoreComments": true }],
        "no-continue": ["off"],
        "no-labels": ["error", {"allowLoop": true, "allowSwitch": true}],
        "no-multiple-empty-lines": ["warn"],
        "no-param-reassign": ["off"],
        "no-plusplus": ["off"],
        "no-restricted-syntax": ["error",
            { selector: "ForInStatement", message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array." },
            { selector: "ForOfStatement", message: "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations." },
            { selector: "WithStatement", message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize." }
        ],
        "no-unused-vars": ["off"],
        "prefer-template": ["warn"],
        "quotes": ["warn", "single"]
    }
};
