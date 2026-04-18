param([string]$OutputPath,[int]$Port=8765)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
try {
  $context = $listener.GetContext()
  $reader = New-Object System.IO.StreamReader($context.Request.InputStream, $context.Request.ContentEncoding)
  $body = $reader.ReadToEnd()
  $reader.Dispose()
  [System.IO.File]::WriteAllText($OutputPath, $body, [System.Text.UTF8Encoding]::new($false))
  $responseBytes = [System.Text.Encoding]::UTF8.GetBytes('ok')
  $context.Response.StatusCode = 200
  $context.Response.OutputStream.Write($responseBytes, 0, $responseBytes.Length)
  $context.Response.Close()
}
finally {
  $listener.Stop()
  $listener.Close()
}