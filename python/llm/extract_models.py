# 一键提取OpenRouter的免费模型，方便导入NEWAPI
# 运行脚本
# 得到两个文件
# txt文件结果复制到channels对应数据表的models列
# json文件结果复制到channels对应数据表的model_mapping列
# 免费模型要在设置里面打开允许供应商训练聊天数据才可以使用
import json
import argparse
import requests


def extract_model_names(models_data):
    """从JSON数据中提取模型名称"""
    simplified_names = []
    name_mapping = {}
    
    for model in models_data.get('data', {}).get('models', []):
        full_name = model.get('slug', '')
        if not full_name:
            continue
        
        # 提取简化名称（去掉前缀和后缀）
        parts = full_name.split('/')
        if len(parts) > 1:
            name_with_suffix = parts[1]
            name_parts = name_with_suffix.split(':')
            simplified_name = name_parts[0]
            simplified_names.append(simplified_name)
            name_mapping[simplified_name] = full_name
    
    return simplified_names, name_mapping


def fetch_models_data(url="https://openrouter.ai/api/frontend/models/find?max_price=0"):
    """从OpenRouter API获取模型数据"""
    try:
        response = requests.get(url)
        response.raise_for_status()  # 如果请求不成功，抛出异常
        return response.json()
    except Exception as e:
        print(f"获取模型数据时出错: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description='从OpenRouter API提取模型')
    parser.add_argument('--output', type=str, default='output.json', help='输出文件名')
    parser.add_argument('--models_txt', type=str, default='models.txt', help='模型名称列表文件')
    parser.add_argument('--url', type=str, default='https://openrouter.ai/api/frontend/models/find?max_price=0',
                        help='OpenRouter API URL')
    args = parser.parse_args()
    
    # 从API获取数据
    models_data = fetch_models_data(args.url)
    if not models_data:
        return
    
    # 提取模型名称
    simplified_names, name_mapping = extract_model_names(models_data)
    
    # 输出逗号分隔的简化名称
    simplified_names_str = ','.join(simplified_names)
    print(simplified_names_str)
    
    # 输出JSON格式的映射
    print(json.dumps(name_mapping, indent=2, ensure_ascii=False))
    
    # 保存简化名称到models.txt
    with open(args.models_txt, 'w', encoding='utf-8') as f:
        f.write(simplified_names_str)
    print(f"模型名称已保存到 {args.models_txt}")
    
    # 保存到文件
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(name_mapping, f, indent=2, ensure_ascii=False)
    print(f"模型映射已保存到 {args.output}")


if __name__ == "__main__":
    main()
