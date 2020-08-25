<template>
    <div id="app">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="scss">
  body {
    margin: 0;
    height: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }

  label {
    font-weight: 700;
  }

  html {
    height: 100%;
    box-sizing: border-box;
  }

  #app {
    height: 100%;
  }
</style>
