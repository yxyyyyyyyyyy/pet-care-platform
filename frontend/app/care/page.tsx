'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { careApi, petsApi, CareRecord, Pet, CareAdvice } from '../../lib/api';
import Layout from '../../components/Layout';
import AuthGuard from '../../components/AuthGuard';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

export default function CarePage() {
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [advice, setAdvice] = useState<CareAdvice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CareRecord | null>(null);
  const [formData, setFormData] = useState({
    pet_id: '',
    record_type: '',
    description: '',
    date: '',
    veterinarian: '',
    cost: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
    fetchRecords();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      fetchAdvice(selectedPet);
    }
  }, [selectedPet]);

  const fetchPets = async () => {
    try {
      const response: any = await petsApi.getAll();
      setPets(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取宠物列表失败');
    }
  };

  const fetchRecords = async (petId?: number) => {
    try {
      const response: any = await careApi.getRecords(petId || undefined);
      setRecords(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取养护记录失败');
    }
  };

  const fetchAdvice = async (petId: number) => {
    try {
      const response: any = await careApi.getAdvice(petId);
      setAdvice(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取养护建议失败');
    }
  };

  const handleOpenModal = (record?: CareRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        pet_id: String(record.pet_id),
        record_type: record.record_type,
        description: record.description || '',
        date: record.date,
        veterinarian: record.veterinarian || '',
        cost: record.cost ? String(record.cost) : '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        pet_id: '',
        record_type: '',
        description: '',
        date: '',
        veterinarian: '',
        cost: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({
      pet_id: '',
      record_type: '',
      description: '',
      date: '',
      veterinarian: '',
      cost: '',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.pet_id || !formData.record_type || !formData.date) {
      setError('请填写必填字段');
      return;
    }

    setLoading(true);

    try {
      const data = {
        pet_id: parseInt(formData.pet_id),
        record_type: formData.record_type,
        description: formData.description || undefined,
        date: formData.date,
        veterinarian: formData.veterinarian || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : null,
      };

      if (editingRecord) {
        await careApi.updateRecord(editingRecord.id, data);
        setSuccess('更新成功');
      } else {
        await careApi.createRecord(data);
        setSuccess('创建成功');
      }
      handleCloseModal();
      fetchRecords(selectedPet || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      await careApi.deleteRecord(recordId);
      setSuccess('删除成功');
      fetchRecords(selectedPet || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || '删除失败');
    }
  };

  const handlePetChange = (petId: string) => {
    const id = petId ? parseInt(petId) : null;
    setSelectedPet(id);
    fetchRecords(id || undefined);
  };

  const getAgeStageText = (stage: string) => {
    const map: Record<string, string> = {
      puppy: '幼年期',
      kitten: '幼年期',
      adult: '成年期',
      senior: '老年期',
    };
    return map[stage] || stage;
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-[55%_42%] lg:gap-x-[3%] gap-y-6">
          <div className="care-main-card">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📝 养护记录</h2>
                <button
                  onClick={() => handleOpenModal()}
                  className="btn btn-primary"
                  disabled={pets.length === 0}
                >
                  + 添加记录
                </button>
              </div>

              <div className="form-group">
                <label>筛选宠物</label>
                <select
                  value={selectedPet || ''}
                  onChange={(e) => handlePetChange(e.target.value)}
                  className="w-full"
                >
                  <option value="">全部宠物</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>

              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

              {records.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">📋</div>
                  <h3>暂无养护记录</h3>
                  <p>点击上方按钮，记录毛孩子的健康状况吧~</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>宠物</th>
                      <th>类型</th>
                      <th>日期</th>
                      <th>兽医</th>
                      <th>费用</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => {
                      const pet = pets.find((p) => p.id === record.pet_id);
                      return (
                        <tr key={record.id}>
                          <td>{pet?.name || '-'}</td>
                          <td>{record.record_type}</td>
                          <td>{record.date}</td>
                          <td>{record.veterinarian || '-'}</td>
                          <td>{record.cost ? `¥${record.cost}` : '-'}</td>
                          <td>
                            <div className="btn-group">
                              <button
                                onClick={() => handleOpenModal(record)}
                                className="btn btn-outline btn-sm"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="btn btn-danger btn-sm"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="care-side-card">
            <div className="advice-card">
              <h2 className="card-title mb-4">💡 养护建议</h2>
              <div className="form-group">
                <label>选择宠物获取建议</label>
                <select
                  value={selectedPet || ''}
                  onChange={(e) => handlePetChange(e.target.value)}
                  className="w-full"
                >
                  <option value="">请选择宠物</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>

              {advice && (
                <div className="mt-4">
                  <div className="advice-pet-info">
                    <h3>{advice.pet.name} ({advice.pet.species})</h3>
                    <p>年龄阶段：{getAgeStageText(advice.age_stage)} | {advice.weight_advice}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="advice-item feeding">
                      <h4>🍽️ 饮食建议</h4>
                      <p>{advice.feeding}</p>
                    </div>
                    <div className="advice-item exercise">
                      <h4>🏃 运动建议</h4>
                      <p>{advice.exercise}</p>
                    </div>
                    <div className="advice-item health">
                      <h4>💊 健康建议</h4>
                      <p>{advice.health}</p>
                    </div>
                    <div className="advice-item grooming">
                      <h4>✂️ 美容建议</h4>
                      <p>{advice.grooming}</p>
                    </div>
                  </div>
                </div>
              )}

              {!advice && pets.length > 0 && (
                <div className="empty-state">
                  <div className="icon">🐾</div>
                  <h3>请选择宠物</h3>
                  <p>选择您的毛孩子，获取专属养护建议~</p>
                </div>
              )}

              {pets.length === 0 && (
                <div className="empty-state">
                  <div className="icon">🐕</div>
                  <h3>暂无宠物</h3>
                  <p>请先添加宠物档案~</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingRecord ? '编辑养护记录' : '添加养护记录'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>宠物 *</label>
              <select
                value={formData.pet_id}
                onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })}
                required
              >
                <option value="">请选择宠物</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>记录类型 *</label>
              <input
                type="text"
                value={formData.record_type}
                onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}
                placeholder="如：疫苗接种、驱虫、体检、洗澡"
                required
              />
            </div>
            <div className="form-group">
              <label>日期 *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>兽医</label>
              <input
                type="text"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                placeholder="兽医姓名"
              />
            </div>
            <div className="form-group">
              <label>费用(元)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="本次花费"
              />
            </div>
            <div className="form-group">
              <label>备注</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细描述"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-secondary flex-1"
              >
                取消
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? '处理中...' : '保存'}
              </button>
            </div>
          </form>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
