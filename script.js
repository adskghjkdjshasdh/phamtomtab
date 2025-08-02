(function() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encodedUrl = params.get('q'); // grab the base64 URL from ?q=

    if (!encodedUrl) throw new Error('Missing target URL');

    // Decode base64 URL string to get the real target URL
    const targetUrl = atob(encodedUrl);

    // Simple check to make sure it’s a valid http(s) URL
    if (!/^https?:\/\//.test(targetUrl)) throw new Error('Invalid URL');

    // Find iframe element by ID
    const iframe = document.getElementById('proxyIframe');

    // Set iframe src to your proxy backend + encoded target URL
    iframe.src = "https://yourproxybackend.example.com/bare/" + encodeURIComponent(targetUrl);

    // When iframe loads, hide the loading message and show the iframe
    iframe.onload = () => {
      document.getElementById('loading').style.display = 'none';
      iframe.style.display = 'block';
      document.title = "My Drive - Google Drive"; // keep tab title stealthy
    };
  } catch (e) {
    // If anything breaks, show an error message on the page
    document.getElementById('loading').innerHTML = '<h2>Error loading proxy</h2><p>' + e.message + '</p>';
  }
})();
