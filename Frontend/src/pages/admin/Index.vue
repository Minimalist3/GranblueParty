<template>
  <div>
    <h1>Admin Console</h1>

    <ul>
      <li><router-link to="/admin/summons">Summons</router-link></li>
      <li><router-link to="/admin/weapons">Weapons</router-link></li>
      <li><router-link to="/admin/sandbox">Sandbox</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Granblue.Party - Admin',
    desc: '',
    image: '',
    keywords: ''
  },
}
</script>
