# Optimizing Styles


Alyle UI contains an optional package that minimizes and optimizes styles created with `lyl`.

This is necessary if you have many styles created with `lyl`.

> Important: Keep in mind that this will change the source files irreversibly, therefore, you should only use it in production.

## Install the Alyle UI CLI

Install the Alyle UI CLI globally.

To install the CLI, open a terminal/console window and enter the following command:


```bash
npm install -g @alyle/ui
```

or

```bash
yarn global add @alyle/ui
```

Test that Alyle UI CLI is installed by running on the root of your App:

```bash
cd My-App
lyl --version
```

> The CLI only works on Angular projects.

# Optimizing Styles with the CLI

It should be noted that this should only be done for production, or when deploying the App, as this will change the source files. For example, you can use this on a CI/CD.

In the root folder of your App run:

```bash
lyl src
```

> Questions? Join the chat at [Discord](https://discord.gg/65hMpAJ).


