import React from 'react';

const AppInfoPage = () => {
  // 定义重复使用的样式
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.8',
    fontSize: '16px',
    backgroundColor: '#f0f0f0'
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: 'auto',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  const boldText = {
    fontWeight: 'bold',
    color: '#d9534f'
  };

  const linkStyle = {
    color: '#337ab7',
    textDecoration: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <p>
          <strong>使用流程：</strong> 首先在插件或小程序中选择词书。当您在阅读中文网站（例如小说）时，打开中文标注功能，系统会自动匹配并显示单词。英文标注的处理方式与此类似。此外，我们的小程序还可以帮助您复习已浏览过的单词。
        </p>
        <p>
          在“懒狗模式”下，系统仅显示每个单词的最常用释义，以降低学习压力。
        </p>
        <p>为什么默认会有已经掌握的单词?因为我选取了一些单词作为停用词，这些是特别简单的。</p>
        <p style={boldText}>
          请注意：本平台的单词翻译由AI生成或AI清洗，可能存在不准确之处。使用时请加以甄别。
        </p>
        <p>
          小程序旨在方便用户回顾浏览的单词，但它并不适合作为主力背单词工具。
        </p>
        <p>
          <strong>网站：</strong> <a href="http://www.dingduang.fun" style={linkStyle}>www.dingduang.fun</a>
        </p>
        <p>
          <strong>邮箱：</strong> <a href="mailto:952490637@qq.com" style={linkStyle}>952490637@qq.com</a>
        </p>
      </div>
    </div>
  );
};

export default AppInfoPage;
