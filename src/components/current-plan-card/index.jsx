import React, { useEffect, useState } from 'react';
import api from '../../configs/axios';
import { Button, Badge } from 'antd';
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function CurrentPlanCard() {
    const [plan, setPlan] = useState(null);
    const navigate = useNavigate();

    const fetchActivePackage = async () => {
        try {
            const response = await api.get('/purchased-plan/active');
            setPlan(response.data);
        } catch (err) {
            setPlan(null);
            console.log(err);
        }
    };

    useEffect(() => {
        fetchActivePackage();
    }, []);

    if (!plan || !plan.packageInfo) {
        return (
            <div className="bg-white border-2 border-[#2563eb] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <GiftOutlined style={{ fontSize: 40, color: '#2563eb', marginBottom: 12 }} />
                <div className="text-lg font-semibold mb-2 text-black">Bạn chưa có gói nào đang hoạt động</div>
                <Button
                    type="primary"
                    size="large"
                    className="rounded-lg mt-2"
                    onClick={() => navigate('/package')}
                >
                    Mua gói ngay
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-[#2563eb] rounded-2xl shadow-lg p-6 flex flex-col max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <GiftOutlined style={{ fontSize: 32, color: '#2563eb' }} />
                <h4 className="text-xl font-bold text-black">{plan.packageInfo.name}</h4>
            </div>
            <div className="mb-2 flex items-center gap-2 text-black">
                <Badge color="blue" />
                <span className="font-semibold">Giá:</span>
                <span className="font-bold text-lg">{plan.packageInfo.price.toLocaleString()} VNĐ</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-black">
                <Badge color="purple" />
                <span className="font-semibold">Thời hạn:</span>
                <span className="font-bold">{plan.packageInfo.duration} ngày</span>
            </div>
            <div className="mb-2 flex items-center gap-2 text-black">
                <CheckCircleOutlined style={{ color: '#22c55e' }} />
                <span className="font-semibold">Trạng thái:</span>
                <span className="font-bold">{plan.status === 'ACTIVE' ? 'Đang hoạt động' : plan.status}</span>
            </div>
            <div className="mb-2 text-black">
                <span className="font-medium">Ngày mua: </span>
                <span>{new Date(plan.purchasedAt).toLocaleDateString()}</span>
            </div>
            <div className="mb-2 text-black">
                <span className="font-medium">Ngày kích hoạt: </span>
                <span>{plan.activationDate ? new Date(plan.activationDate).toLocaleDateString() : <span className="text-gray-400">Chưa kích hoạt</span>}</span>
            </div>
        </div>
    );
}

export default CurrentPlanCard;