<template>
  <div class="home">
    <div class="jumbotron">
    <img alt="Vue logo" src="../assets/home.png">
    <HelloWorld msg="LESS CRIME, MORE DIME"/>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>