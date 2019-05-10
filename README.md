# issuer
一休：将 GitHub issues &amp; comments 导出，并生成 issue 书

## 运行环境

- 目前只在 Mac OSX 中测试过

## 要求

- 安装 [Node.js 10](http://yiilib.com/topic/723/Mac%E4%BD%BF%E7%94%A8Homebrew%E5%AE%89%E8%A3%85%E6%8C%87%E5%AE%9A%E7%89%88%E6%9C%ACNodejs)（其他版本未测试） `brew install node@10`
- 安装 Git
- 命令行操作

## 使用方式

1. 打开命令行，下载项目，并进入项目

```bash
git clone https://github.com/hexcola/issuer
cd issuer
```

2. 在项目目录下创建 `output` 目录，并在 `output` 目录下分别创建 `issues` 和 `comments` 目录，你的 issue 和 comment 会分别存在这两个目录。

```bash
mkdir -p output/issues output/comments
```

3. 找到 `config.yml` 文件，进行修改：

    - `token`: 需要在 GitHub 上配置一个
    - `owner`: 项目所属人（组织）的名字
    - `repo`: 仓库的名字
    - 其他：默认就好

4. 安装依赖，然后运行：

```bash
npm install
node ant.js
```

## 参考

- [GitHub REST API v3](https://developer.github.com/v3/)
- [octokit/rest.js](https://octokit.github.io/rest.js/#usage)
