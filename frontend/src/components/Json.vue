<script setup>
defineProps({
  value: JSON,
});

const jsonColor = (json) => {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
};
</script>

<template>
  <pre v-html="jsonColor(value)"></pre>
</template>

<style>
pre {
  padding: 5px;
  margin: 5px;
}

body.dark-only .string {
  color: #ffffff99;
}
.string {
  color: #2f2f3b;
}

.number {
  color: rgb(53, 88, 247);
}

.boolean {
  color: #7366ff;
}

.null {
  color: rgb(247, 222, 247);
}

.key {
  color: #fd5d93;
  font-weight: bold;
}
</style>
