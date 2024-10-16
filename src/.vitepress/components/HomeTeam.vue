<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme';

const teamMembers = [
  {
    avatar: 'https://github.com/ModyQyW.png',
    name: 'ModyQyW',
    title: 'Author',
    links: [
      { icon: 'github', link: 'https://github.com/ModyQyW' },
    ],
  },
  {
    avatar: 'https://github.com/edwinhuish.png',
    name: 'edwinhuish',
    title: 'Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/edwinhuish' },
    ],
  },
];
</script>

<template>
  <div>
    <h2 style="text-align: center;">
      团队成员
    </h2>
    <VPTeamMembers size="small" :members="teamMembers" />
  </div>
</template>
