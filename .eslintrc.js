module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'camelcase': 'off',
        'indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        'vue/html-indent': ['error', 4],
        'comma-dangle': ['error', 'only-multiline']
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
