# LocalLLMChat

## 説明

このアプリケーションは家庭用PCなどのリソースの限られた環境下でLLMをLarge Language Model(LLM)を動かすことを目的に作成されました。

機械学習用ライブラリであるGGMLを使用しており、モデルは予めGGML形式に変換されている必要があります。

## ことはじめ

### モデルの用意

はじめにモデルを用意しましょう。

現在、このアプリケーションは以下のモデルアーキテクチャに対応しています。

- BLOOM
- GPT-2
- GPT-J
- GPT-NeoX
- LLaMA
- MPT

先で述べたように、モデルはGGMLに変換されている必要があります。

変換されたモデルをダウンロードするか、[ggml](https://github.com/ggerganov/ggml)または[llama.cpp](https://github.com/ggerganov/llama.cpp)を用いて変換してください。

このREADMEでは例として[llama-2-7b-chat](https://huggingface.co/meta-llama/Llama-2-7b-chat)を使用します。

ggml変換済みモデルは[Llama-2-7B-Chat-GGML](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML)などからダウンロードできます。

### モデルの配置

用意したモデルは指定されたディレクトリに配置する必要があります。

画像中の赤丸のボタンからディレクトリを開くことが出来ます。

![2023-07-25 (2)](https://github.com/yu7400ki/LocalLLMChat/assets/104719412/a6a08ab2-9a08-4f59-a728-420886031df4)

### プロンプトの設定

プロンプトの設定は以下のフィールドからなります。

| Setting | 説明 |
| --- | --- |
| Context | プロンプトの先頭につけられる。主にシステムプロンプトなどに使用される。 |
| User Prefix | ユーザープロンプトの先頭につけられる。 |
| User Suffix | ユーザープロンプトの末尾につけられる。 |
| Bot Prefix | ボットプロンプトの先頭につけられる。 |
| Bot Suffix | ボットプロンプトの末尾につけられる。 |
| Stop Word | これが生成された場合に推論を止めるワード。 |

llama2であれば次のように埋めてください。

- Context
```
<s>[INST] <<SYS>>
{{ prompt }}
<</SYS>>


```
`{{ prompt }}`には任意のシステムプロンプト入れる

- User Prefix
```
```
空欄

- User Suffix
```
 [/INST] 
```

- Bot Prefix
```
```
空欄

- Bot Suffix
```
 </s><s>[INST] 
```

- Stop Word
```
</s>
```

### 推論

メッセージを入力してチャットを開始しましょう！
