// 引入 React 相关的库和 Hooks
import React, { useState, useEffect } from 'react';
// 引入页面和样式文件
// 引入高阶组件
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

// 引入 UI 组件
import { Checkbox, Col, Divider, Row, Slider } from 'antd';
import { createWebsiteRulesDropdownItems } from '@src/shared/views/settings/settingsService';
import {
  CardWithDropdown,
  InnerCard,
  SwitchCard,
  SwitchCardWithDropdown,
} from '@src/shared/components/SomeSetting/SomeSetting';
import { FeatureSettings, settingsManager } from '@src/shared/storages/SettingsManager';
import { getCurrentDomain } from '@src/shared/utils/ChromExtendTool';
import {
  AnnotateConfig,
  handleSourceLanguageAnnotate, handleTargetLanguageAnnotate,
  resetAnnotations,
} from '@pages/content/injected/annotate/textProcessor';
import { sendMessageToContent } from '@src/shared/utils/MessagingTool';

// 设置页面的主要组件
const SettingPage = () => {

  // 语言
  const [targetLanguage, setTargetLanguage] = useState('英文');
  const [sourceLanguage] = useState('中文');
  // 定义各种状态，用于控制页面的行为和展示
  const [autoToggle, setAutoToggle] = useState(false); // 自动开启功能是否启用
  const [lazyMode, setLazyMode] = useState(false); // 懒狗模式是否启用
  const [annotateEnglish, setAnnotateEnglish] = useState(false); // 是否标注英文
  const [annotateChinese, setAnnotateChinese] = useState(false); // 是否标注中文
  // 下拉菜单选择的状态
  const [englishDropdownSelected, setEnglishDropdownSelected] = useState('annotateOnly'); // 英文标注方式的选择
  const [chineseDropdownSelected, setChineseDropdownSelected] = useState('annotateOnly'); // 中文标注方式的选择
  const [websiteRuleSelected, setWebsiteRuleSelected] = useState('default'); // 网站规则的选择
  //const [websiteRules, setWebsiteRules] = useState([]); // 存储的网站规则数组
  // 网站规则下拉菜单项
  const [websiteRulesDropdownItems, setWebsiteRulesDropdownItems] = useState([]);
  const [domain, setDomain] = useState(''); // 当前域名
  // 定义下拉菜单项
  const englishDropdownItems = [
    { key: 'annotateOnly', content: '仅标注' },
    { key: 'topChinese', content: '顶部' + sourceLanguage },
    { key: 'sideChinese', content: '侧边' + sourceLanguage },
  ];
  const chineseDropdownItems = [
    { key: 'annotateOnly', content: '仅标注' },
    { key: 'topEnglish', content: '顶部' + targetLanguage },
    { key: 'sideEnglish', content: '侧边' + targetLanguage },
    { key: 'replaceChinese', content: '替换成' + targetLanguage },
  ];

  // 更多设置的状态
  const [useUnderline, setUseUnderline] = useState(false); // 是否使用下划线
  const [useTextHighlight, setUseTextHighlight] = useState(false); // 是否使用文本高亮
  const [annotateFrequency, setAnnotateFrequency] = useState(60); // 标注频率
  const [useBold, setUseBold] = useState(false); // 是否使用加粗

  // 异步加载设置和网站规则下拉菜单项的效果
  useEffect(() => {
    // 调用初始化设置的函数
    initSettings();

  }, []);

  // 定义初始化设置的函数
  const initSettings = async () => {
    const settings = await settingsManager.loadSettings();
    // 目标语言设置
    if (settings.targetLanguage === 'en') {
      setTargetLanguage('英文');
    } else if (settings.targetLanguage === 'jp') {
      setTargetLanguage('日文');
    }
    const featureSettings = settings.featureSettings;
    // 功能设置

    // 设置各种状态
    setLazyMode(featureSettings.lazyModeToggle);
    setUseBold(featureSettings.useBold);
    setUseTextHighlight(featureSettings.useTextHighlight);
    setUseUnderline(featureSettings.useUnderline);
    setAnnotateFrequency(featureSettings.annotateFrequency);
    setEnglishDropdownSelected(featureSettings.annotateTargetLanguageType);
    setChineseDropdownSelected(featureSettings.annotateSourceLanguageType);

    // 根据网站规则和自动开启设置，设置标注的状态
    const domain:string=window.location.hostname;
    setWebsiteRulesDropdownItems(createWebsiteRulesDropdownItems(domain));
    setDomain(domain);

    const rules = featureSettings.websiteRules;
    rules.forEach(rule => {
      if (rule.website === domain) {
        setWebsiteRuleSelected(rule.rule);
        if (rule.rule === 'alwaysAnnotateEnglish') {
          setAnnotateEnglish(true);
        } else if (rule.rule === 'alwaysAnnotateChinese') {
          setAnnotateChinese(true);
        }

      }
    });

    if (featureSettings.openNewPageAutoToggle) {
      setAutoToggle(true);
      setAnnotateEnglish(featureSettings.annotateTargetLanguageToggle);
      setAnnotateChinese(featureSettings.annotateSourceLanguageToggle);
    }

  };

  // 处理当前页面是否开启注释
  const handleOpenAnnotate = async (targetOpen: boolean, sourceOpen: boolean) => {
    const settings = await settingsManager.loadSettings();
    const data: AnnotateConfig = {
      'lazeMode': settings.featureSettings.lazyModeToggle || false,
      'annotateType': settings.featureSettings.annotateTargetLanguageType,
      'annotateFrequency': settings.featureSettings.annotateFrequency || 50,
      'useUnderline': settings.featureSettings.useUnderline || false,
      'useTextHighlight': settings.featureSettings.useTextHighlight || false,
      'useBold': settings.featureSettings.useBold || false,
      'sourceLanguage': settings.sourceLanguage || '中文',
      'targetLanguage': settings.targetLanguage || '英文',
      'lemmatize': false,
    };
    if (targetOpen) {
      handleTargetLanguageAnnotate(data)
    }else if(sourceOpen) {
      data.annotateType = settings.featureSettings.annotateSourceLanguageType;
      handleSourceLanguageAnnotate(data)
    }else{
      // 还原
      resetAnnotations();
    }

  };


  // 定义处理英文标注方式下拉框变化的函数
  const handleEnglishDropdownChange = e => {
    const value = e.target.value;
    setEnglishDropdownSelected(value);
    const updateData: Partial<FeatureSettings> = { annotateTargetLanguageType: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义处理中文标注方式下拉框变化的函数
  const handleChineseDropdownChange = e => {
    const value = e.target.value;
    setChineseDropdownSelected(value);
    const updateData: Partial<FeatureSettings> = { annotateSourceLanguageType: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义处理网站规则下拉框变化的函数
  const handleWebsiteRulesDropdownChange = e => {
    const value = e.target.value;
    setWebsiteRuleSelected(value);
    const rule = value === 'default' ? '' : value;
    const updateData: Partial<FeatureSettings> = { websiteRules: [{ website: domain, rule }] };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储自动开启的函数
  const setAndStoreAutoToggle = (value: boolean) => {
    // 设置自动开启
    setAutoToggle(value);
    // 存储自动开启
    const updateData: Partial<FeatureSettings> = { openNewPageAutoToggle: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储懒狗模式的函数
  const setAndStoreLazyMode = (value: boolean) => {
    // 设置懒狗模式
    setLazyMode(value);
    // 存储懒狗模式
    const updateData: Partial<FeatureSettings> = { lazyModeToggle: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储英文标注的函数
  const setAndStoreAnnotateEnglish = (value: boolean, needStore: boolean = true) => {
    // 设置英文标注
    setAnnotateEnglish(value);
    // 存储英文标注
    if (needStore) {
      const updateData: Partial<FeatureSettings> = { annotateTargetLanguageToggle: value };
      settingsManager.updateFeatureSettings(updateData);
    }
    // 处理操作
    handleOpenAnnotate(value, false);
  };

  // 定义设置并存储中文标注的函数
  const setAndStoreAnnotateChinese = (value: boolean, needStore: boolean = true) => {
    // 设置中文标注
    setAnnotateChinese(value);
    // 存储中文标注
    if (needStore) {
      const updateData: Partial<FeatureSettings> = { annotateSourceLanguageToggle: value };
      settingsManager.updateFeatureSettings(updateData);
    }
    // 处理操作
    handleOpenAnnotate(false, value);
  };

  // 定义设置并存储使用下划线的函数
  const setAndStoreUseUnderline = (value: boolean) => {
    // 设置使用下划线
    setUseUnderline(value);
    // 存储使用下划线
    const updateData: Partial<FeatureSettings> = { useUnderline: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储使用文本高亮的函数
  const setAndStoreUseTextHighlight = (value: boolean) => {
    // 设置使用文本高亮
    setUseTextHighlight(value);
    // 存储使用文本高亮
    const updateData: Partial<FeatureSettings> = { useTextHighlight: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储标注频率的函数
  const setAndStoreAnnotateFrequency = (value: number) => {
    // 设置标注频率
    setAnnotateFrequency(value);
    // 存储标注频率
    const updateData: Partial<FeatureSettings> = { annotateFrequency: value };
    settingsManager.updateFeatureSettings(updateData);
  };

  // 定义设置并存储加粗的函数
  const setAndStoreUseBold = (value: boolean) => {
    // 设置加粗
    setUseBold(value);
    // 存储加粗
    const updateData: Partial<FeatureSettings> = { useBold: value };
    settingsManager.updateFeatureSettings(updateData);
  };
  return (
    <div className="SideBarSettingPage processed-dingdang-never" style={{padding:'10px',width:"90%"}}>
      <div>
        <Divider orientation="left" style={{ marginTop: 0 }} className={"processed-dingdang-never"}>
          基 本 设 置
        </Divider>
        <Row gutter={8}>
          <Col span={11}>
            <SwitchCard  isOn={autoToggle} description="自 动 开 启" onToggle={() => setAndStoreAutoToggle(!autoToggle)} />
          </Col>
          <Col span={2} />
          <Col span={11}>
            <SwitchCard isOn={lazyMode} description="懒 狗 模 式" onToggle={() => setAndStoreLazyMode(!lazyMode)} />
          </Col>
        </Row>

        <Row>
          <SwitchCardWithDropdown
            isOn={annotateEnglish}
            description={targetLanguage + '标注'}
            onToggle={() => setAndStoreAnnotateEnglish(!annotateEnglish)}
            dropdownItems={englishDropdownItems}
            selectedValue={englishDropdownSelected}
            onDropdownChange={handleEnglishDropdownChange}
          />
        </Row>
        <Row>
          <SwitchCardWithDropdown
            isOn={annotateChinese}
            description={sourceLanguage + '标注'}
            onToggle={() => setAndStoreAnnotateChinese(!annotateChinese)}
            dropdownItems={chineseDropdownItems}
            selectedValue={chineseDropdownSelected}
            onDropdownChange={handleChineseDropdownChange}
          />
        </Row>
        <Row>
          <CardWithDropdown
            dropdownItems={websiteRulesDropdownItems}
            selectedValue={websiteRuleSelected}
            onDropdownChange={handleWebsiteRulesDropdownChange}
          />
        </Row>
        <Divider className={'processed-dingdang-never'} orientation="left" style={{ marginTop: 6 }}>

          <span className={'processed-dingdang-never'}>更多设置</span>
        </Divider>
        <Row>
          <InnerCard style={{ display: 'block', padding: '15px' }}>
            <Row style={{ marginBottom: '10px' }} gutter={10}>
              <Col>
                <Checkbox className={'processed-dingdang-never'} onChange={e => setAndStoreUseBold(e.target.checked)}
                          checked={useBold}>

                  <span className={'processed-dingdang-never'}>加粗</span>
                </Checkbox>
              </Col>
              <Col>
              <Checkbox className={'processed-dingdang-never'}
                          onChange={e => setAndStoreUseTextHighlight(e.target.checked)} checked={useTextHighlight}>

                  <span className={'processed-dingdang-never'}>文本高亮</span>
                </Checkbox>
              </Col>
              <Col>
              <Checkbox onChange={e => setAndStoreUseUnderline(e.target.checked)} checked={useUnderline} className={'processed-dingdang-never'}>
                  <span className={'processed-dingdang-never'}>下划线</span>
                </Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p className={'processed-dingdang-never'}>标注频率</p>

              </Col>
              <Col span={24}>
                <Slider
                  defaultValue={annotateFrequency}
                  onChange={value => setAndStoreAnnotateFrequency(value)}
                  disabled={false}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }} gutter={15}>

            </Row>
          </InnerCard>
        </Row>
      </div>
    </div>
  );
};

// 使用withErrorBoundary和withSuspense高阶组件包装SettingPage组件，为其添加错误边界和延迟加载的功能
export default withErrorBoundary(withSuspense(SettingPage, <div>Loading...</div>), <div>Error Occurred</div>);
