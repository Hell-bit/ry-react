import * as React from "react";
import CopyableIcon from "./CopyableIcon";
import type { ThemeType } from "./index";
import type { CategoriesKeys } from "./fields";
import styles from "./style.less";

interface CategoryProps {
	title: CategoriesKeys;
	icons: string[];
	theme: ThemeType;
	newIcons: string[];
	onSelect: (type: string, name: string) => any;
}

const Category: React.FC<CategoryProps> = props => {
	const { icons, title, newIcons, theme } = props;
	const [justCopied, setJustCopied] = React.useState<string | null>(null);
	const copyId = React.useRef<NodeJS.Timeout | null>(null);
	const onSelect = React.useCallback((type: string, text: string) => {
		const { onSelect } = props;
		if (onSelect) {
			onSelect(type, text);
		}
		setJustCopied(type);
		copyId.current = setTimeout(() => {
			setJustCopied(null);
		}, 2000);
	}, []);
	React.useEffect(
		() => () => {
			if (copyId.current) {
				clearTimeout(copyId.current);
			}
		},
		[]
	);

	return (
		<div style={{ overflow: "hidden" }}>
			<h4>{title}</h4>
			<ul style={{ overflow: "hidden", fontSize: 20 }}>
				{icons.map(name => (
					<CopyableIcon
						key={name}
						name={name}
						theme={theme}
						isNew={newIcons.includes(name)}
						justCopied={justCopied}
						onSelect={onSelect}
					/>
				))}
			</ul>
		</div>
	);
};

export default Category;
