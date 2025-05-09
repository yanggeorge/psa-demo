export function parseXML(xmlString: string) {
  // 创建一个解析器
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // 检查解析错误
  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    throw new Error('XML解析错误: ' + parseError[0].textContent);
  }

  // 解析结果对象
  const result = {
    name: xmlDoc.documentElement.getAttribute('name') || '未命名',
    faultTrees: [] as any[],
    gates: [] as any[],
    basicEvents: [] as any[],
    houseEvents: [] as any[],
  };

  // 解析故障树
  const faultTreeElements = xmlDoc.getElementsByTagName('define-fault-tree');
  for (let i = 0; i < faultTreeElements.length; i++) {
    const treeElement = faultTreeElements[i];
    const treeName = treeElement.getAttribute('name') || `Tree${i + 1}`;

    const treeGates: any[] = [];

    // 解析门
    const gateElements = treeElement.getElementsByTagName('define-gate');
    for (let j = 0; j < gateElements.length; j++) {
      const gateElement = gateElements[j];
      const gateName = gateElement.getAttribute('name') || `Gate${j + 1}`;

      // 获取标签
      const labelElement = gateElement.getElementsByTagName('label')[0];
      const label = labelElement ? labelElement.textContent || gateName : gateName;

      // 获取门类型和子节点
      let gateType = '';
      const children: string[] = [];

      // 检查门类型
      const possibleTypes = ['and', 'or', 'xor', 'not', 'nand', 'nor', 'iff', 'imply', 'atleast', 'cardinality'];
      for (const type of possibleTypes) {
        const typeElement = gateElement.getElementsByTagName(type)[0];
        if (typeElement) {
          gateType = type;

          // 获取子节点
          const eventElements = typeElement.getElementsByTagName('event');
          for (let k = 0; k < eventElements.length; k++) {
            const eventName = eventElements[k].getAttribute('name');
            if (eventName) {
              children.push(eventName);
            }
          }

          // 对于atleast和cardinality类型，获取k和l值
          if (type === 'atleast') {
            const kValue = typeElement.getAttribute('min') || '1';
            gateType = `${type}:${kValue}`;
          } else if (type === 'cardinality') {
            const kValue = typeElement.getAttribute('min') || '1';
            const lValue = typeElement.getAttribute('max') || '1';
            gateType = `${type}:${kValue}:${lValue}`;
          }

          break;
        }
      }

      // 添加到门列表
      const gate = {
        name: gateName,
        label,
        type: gateType,
        children,
      };

      treeGates.push(gate);

      // 添加到全局门列表
      result.gates.push(gate);
    }

    // 添加故障树
    result.faultTrees.push({
      name: treeName,
      gates: treeGates,
    });
  }

  // 解析基本事件
  const basicEventElements = xmlDoc.getElementsByTagName('define-basic-event');
  for (let i = 0; i < basicEventElements.length; i++) {
    const eventElement = basicEventElements[i];
    const eventName = eventElement.getAttribute('name') || `BasicEvent${i + 1}`;

    // 获取标签
    const labelElement = eventElement.getElementsByTagName('label')[0];
    const label = labelElement ? labelElement.textContent || eventName : eventName;

    // 获取概率
    let probability = 0;
    const floatElement = eventElement.getElementsByTagName('float')[0];
    if (floatElement) {
      probability = Number.parseFloat(floatElement.getAttribute('value') || '0');
    }

    // 添加到基本事件列表
    result.basicEvents.push({
      name: eventName,
      label,
      probability,
    });
  }

  // 解析房屋事件
  const houseEventElements = xmlDoc.getElementsByTagName('define-house-event');
  for (let i = 0; i < houseEventElements.length; i++) {
    const eventElement = houseEventElements[i];
    const eventName = eventElement.getAttribute('name') || `HouseEvent${i + 1}`;

    // 获取标签
    const labelElement = eventElement.getElementsByTagName('label')[0];
    const label = labelElement ? labelElement.textContent || eventName : eventName;

    // 获取状态
    let state = false;
    const constantElement = eventElement.getElementsByTagName('constant')[0];
    if (constantElement) {
      state = constantElement.getAttribute('value') === 'true';
    }

    // 添加到房屋事件列表
    result.houseEvents.push({
      name: eventName,
      label,
      state,
    });
  }

  return result;
}
