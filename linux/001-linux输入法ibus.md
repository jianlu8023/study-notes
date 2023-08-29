# linux输入法ibus

----

* 卸载其他输入法

```bash
apt purge sougoupinyin
apt remove sougoupinyin*
apt purge fcitx
apt remove fcitx*
apt autoremove
```

* 删除配置文件

```bash
cd ~/.config

rm -rf sougoupintin
rm -rf ibus
```

* 安装ibus

```bash
apt install ibus ibus-rime
```

* 配置ibus


1. 进入设置->区域与语言->输入源-> +

2. 选择 中文rime

3. 删除其他不需要的输入法

4. 管理已安装的语言->键盘输入法系统

5. 选择ibus

6. 重启ibus

```bash
ibus restart
```

7. 个性化配置

```bash
cd ~/.config/ibus/rime

vi default_custom.yaml


```

输入以下内容到default_custom.yaml文件

```yaml
patch:
  schema_list:
    - schema: luna_pinyin_simp
  menu:
    page_size: 5
  ascii_composer:
    switch_key:
      Shift_L: commit_code

```

设置横排显示

```bash
cd ~/.config/ibus/rime/build/
vi ibus_rime.yaml
```

将下列文字粘贴到ibus_rime.yaml文件中

```yaml
style:
  horizontal: true
```

8. 重启ibus

```bash
ibus restart
```

9. 解决 ibus输入法导致wps启动慢

```bash
sudo apt install libcanberra-gtk-module
sudo apt install appmenu-gtk2-module
```

