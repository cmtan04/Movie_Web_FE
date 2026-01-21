import { Button, Menu, MenuProps, Form } from "antd";
import { DashOutlined, DownOutlined } from "@ant-design/icons";
import bgLogin from "../../assets/bg-login.jpg";
import { FormSearch } from "../FormSearch/formSearch";
import SearchDropdown from "../SearchDropdown";
import "./topbar.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onSearchSubmit: (value: any) => void;
}

export const TopBar = (props: TopBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Debounce search: trigger after user stops typing for 500ms
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchValue.trim() && !isNavigating) {
      setShowDropdown(true);
      debounceTimeout.current = setTimeout(() => {
        props.onSearchSubmit(searchValue);
      }, 500);
    } else {
      setShowDropdown(false);
      props.onSearchSubmit("");
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue, isNavigating]);

  const items: MenuProps["items"] = [
    {
      key: "phimle",
      label: "Phim lẻ",
    },
    {
      key: "phimbo",
      label: "Phim bộ",
    },
    {
      key: "theloai",
      label: (
        <span>
          Thể loại <DownOutlined />
        </span>
      ),
      children: [
        {
          key: "hanh-dong",
          label: "Hành động",
        },
        {
          key: "tinh-cam",
          label: "Tình cảm",
        },
        {
          key: "hai-huoc",
          label: "Hài hước",
        },
        {
          key: "kinh-di",
          label: "Kinh dị",
        },
        {
          key: "vien-tuong",
          label: "Viễn tưởng",
        },
        {
          key: "tam-ly",
          label: "Tâm lý",
        },
        {
          key: "hinh-su",
          label: "Hình sự",
        },
        {
          key: "phieu-luu",
          label: "Phiêu lưu",
        },
      ],
    },
    {
      key: "quocgia",
      label: (
        <span>
          Quốc gia <DownOutlined />
        </span>
      ),
      children: [
        {
          key: "viet-nam",
          label: "Việt Nam",
        },
        {
          key: "han-quoc",
          label: "Hàn Quốc",
        },
        {
          key: "trung-quoc",
          label: "Trung Quốc",
        },
        {
          key: "nhat-ban",
          label: "Nhật Bản",
        },
        {
          key: "thai-lan",
          label: "Thái Lan",
        },
        {
          key: "my",
          label: "Mỹ",
        },
        {
          key: "anh",
          label: "Anh",
        },
        {
          key: "phap",
          label: "Pháp",
        },
      ],
    },
    {
      key: "them",
      label: (
        <span>
          <DashOutlined />
        </span>
      ),
      children: [
        {
          key: "phim-chieu-rap",
          label: "Phim chiếu rạp",
        },
        {
          key: "phim-sap-chieu",
          label: "Phim sắp chiếu",
        },
        {
          key: "top-phim",
          label: "Top phim",
        },
        {
          key: "phim-de-cu",
          label: "Phim đề cử",
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const genreMap: { [key: string]: string } = {
      'hanh-dong': '28',
      'tinh-cam': '10749',
      'hai-huoc': '35',
      'kinh-di': '27',
      'vien-tuong': '878',
      'tam-ly': '53',
      'hinh-su': '80',
      'phieu-luu': '12',
    };

    const countryMap: { [key: string]: string } = {
      'viet-nam': 'VN',
      'han-quoc': 'KR',
      'trung-quoc': 'CN',
      'nhat-ban': 'JP',
      'thai-lan': 'TH',
      'my': 'US',
      'anh': 'GB',
      'phap': 'FR',
    };

    let params = '';

    if (e.key === 'phimle') {
      params = '?type=movie';
    } else if (e.key === 'phimbo') {
      params = '?type=tv';
    } else if (genreMap[e.key]) {
      params = `?genre=${genreMap[e.key]}`;
    } else if (countryMap[e.key]) {
      params = `?country=${countryMap[e.key]}`;
    } else if (e.key === 'phim-chieu-rap') {
      params = '?year=' + new Date().getFullYear();
    } else if (e.key === 'phim-sap-chieu') {
      params = '?year=' + (new Date().getFullYear() + 1);
    } else if (e.key === 'top-phim') {
      params = '?sort=vote_average.desc';
    } else if (e.key === 'phim-de-cu') {
      params = '?sort=popularity.desc';
    }

    if (params) {
      navigate(`/filter${params}`);
    }
  };

  return (
    <div className="top__bar">
      <div className="left">
        <div className="top__bar-logo" onClick={() => navigate('/dash-board')} style={{ cursor: 'pointer' }}>
          MOVIE
        </div>

        <div className="top__bar-search">
          <Form
            onFinish={(values) => {
              const value = values.search;
              if (value && value.trim()) {
                setIsNavigating(true);
                navigate(`/search?query=${encodeURIComponent(value.trim())}`);
                setShowDropdown(false);
                setSearchValue("");
                setTimeout(() => setIsNavigating(false), 100);
              }
            }}
          >
            <FormSearch
              label=""
              name="search"
              allowClear
              onChange={(e: any) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Tìm kiếm phim, diễn viên"
            />
          </Form>
          {showDropdown && searchValue.trim() && (
            <SearchDropdown
              query={searchValue}
              onClose={() => {
                setShowDropdown(false);
                setSearchValue("");
              }}
            />
          )}
        </div>
        <div className="top__bar-menu">
          <Menu
            onClick={handleMenuClick}
            mode="horizontal"
            items={items}
            className="top__bar-menu-list"
          />
        </div>
      </div>
      <div className="right">
        <div className="top__bar-account">
          <Button className="label">Thành viên</Button>
        </div>
      </div>
    </div>
  );
};
