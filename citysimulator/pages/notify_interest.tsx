export default function Document() {
  return (
    <form action="/api/notify_interest" method="POST">
    <input type="text" name="file_path" placeholder="Enter file path" />  
    <button type="submit">Notify interest</button>
    </form>
  )
}
