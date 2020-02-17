function getHead(vm) {
  // components can simply provide a `title` option
  // which can be either a string or a function
  const { head } = vm.$options

  if (head) {
    return head;
  }
}

function getKeywords(head) {
  if (head.keywords) {
    return DEFAULT_KEYWORDS + ', ' + head.keywords;
  }
  return DEFAULT_KEYWORDS;
}

const DEFAULT_TITLE = 'Granblue.Party - Granblue Fantasy Tools';
const DEFAULT_DESC = 'A collection of useful tools for Granblue Fantasy';
const DEFAULT_IMAGE = 'https://www.granblue.party/img/preview_party.png';
const DEFAULT_KEYWORDS = 'Granblue Fantasy, GBF, Cygames, tools';

const serverTitleMixin = {
  created() {
    const head = getHead(this)
    if (head) {
      this.$ssrContext.head_title = head.title || DEFAULT_TITLE;
      this.$ssrContext.head_desc = head.desc || DEFAULT_DESC;
      this.$ssrContext.head_image = head.image || DEFAULT_IMAGE;
      this.$ssrContext.head_keywords = getKeywords(head);

      this.$ssrContext.head_path = "https://www.granblue.party" + this.$route.fullPath;
    }
  }
}

function changeDocument(vm) {
  const head = getHead(vm)
  if (head) {
    document.title = head.title || DEFAULT_TITLE;
    document.querySelector('meta[name="title"]').setAttribute('content', head.title || DEFAULT_TITLE);
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', head.title || DEFAULT_TITLE);
    document.querySelector('meta[property="og:title"]').setAttribute('content', head.title || DEFAULT_TITLE);

    document.querySelector('meta[name="description"]').setAttribute('content', head.desc || DEFAULT_DESC);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', head.desc || DEFAULT_DESC);
    document.querySelector('meta[property="og:description"]').setAttribute('content', head.desc || DEFAULT_DESC);

    document.querySelector('meta[name="twitter:image"]').setAttribute('content', head.image || DEFAULT_IMAGE);
    document.querySelector('meta[property="og:image"]').setAttribute('content', head.image || DEFAULT_IMAGE);

    document.querySelector('meta[property="og:url"]').setAttribute('content', "https://www.granblue.party" + vm.$route.fullPath);
    document.querySelector('link[rel="canonical"]').setAttribute('href', "https://www.granblue.party" + vm.$route.fullPath);

    document.querySelector('meta[name="keywords"]').setAttribute('content', getKeywords(head));
  }
}

const clientTitleMixin = {
  mounted() {
    changeDocument(this);
  },
  watch: {
    '$route.fullPath'() {
      changeDocument(this);
    }
  }
}

// `VUE_ENV` can be injected with `webpack.DefinePlugin`
export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin