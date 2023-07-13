<font color="#fc1c50">Đỏ</font>
<font color="#fca61c">Vàng</font>
<font color="#1caafc">Xanh</font>

# <font color="#fca61c">🥇 Debug & Error Handling Skills</font>

<img width="32" height="32" src="https://img.icons8.com/fluency/48/typescript--v2.png" alt="typescript--v2"/>

Lỗi liên quan đến data types không đúng, có thể bypass bằng any hoặc setting tsconfig

  <br>

<img width="32" height="32" src="https://img.icons8.com/color/48/eslint.png" alt="eslint"/>

Lỗi liên quan đến linter, có thể bypass bằng disable hoặc setting eslint

  <br>

<img width="32" height="32" src="https://img.icons8.com/fluency/48/node-js.png" alt="node-js"/>

Đây là lỗi nghiêm trọng liên quan đến code. Không nên bypass lỗi này mà phải xử lý

  <br>

<img width="32" height="32" src="https://img.icons8.com/color/48/idea-sharing.png" alt="idea-sharing"/>

Run and Debug

ChatGPT

Console.log

  <br>

# <font color="#fca61c">🥇 Demonstration</font>

```ts
interface User {
  name: string
  age: number
}

const render = (use: User) => {
  console.log(user)
}

const user = { name: 'Decade' }

render(user) // TypeScript Error : age is missing

// Bypass
render(user as any) // any
render(user as User) // User
render(user as unknown as User) // unknown
render(user as Partial<User>) // Partial
render(user as Required<User>) // Required
render(user as Readonly<User>) // Readonly
render(user as Pick<User, 'name'>) // Pick
render(user as Omit<User, 'age'>) // Omit
render(user as Exclude<User, 'age'>) // Exclude
render(user as Extract<User, { name: string }>) // Extract
render(user as NonNullable<User>) // NonNullable
render(user as Parameters<typeof render>) // Parameters
render(user as ReturnType<typeof render>) // ReturnType
render(user as ConstructorParameters<typeof User>) // ConstructorParameters
render(user as InstanceType<typeof User>) // InstanceType
render(user as ThisParameterType<typeof render>) // ThisParameterType
render(user as OmitThisParameter<typeof render>) // OmitThisParameter
render(user as ThisType<User>) // ThisType
```

```ts
const profile: any = {
  name: 'Pikachu'
} // eslint Error : Unexpected any. Specify a different type

// fix:
const profile: {
  name: string
} = {
  name: 'Pikachu'
}

// bypass:
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const profile: any = {
  name: 'Pikachu'
}
```
